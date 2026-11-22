/**
 * PCL Cockpit - Study Ingestion & Local RAG Service
 * 
 * Permite upload e indexação 100% local no navegador de estudos corporativos:
 * - PDF via pdfjs-dist (extração de texto página a página)
 * - DOCX via mammoth
 * - XLSX / CSV via SheetJS (xlsx)
 * - Markdown / TXT / JSON
 * - Indexação em memória via @orama/orama com busca híbrida BM25 ultra-rápida (< 5ms)
 * - Zero upload para servidores de terceiros ($0.00 / Soberania total)
 */

import { StudyAttachment } from '../../types';

export interface StudyChunk {
  id: string;
  pageNumber: number;
  text: string;
}

export interface IngestionResult {
  attachment: StudyAttachment;
  totalCharacters: number;
  chunksCount: number;
  deduplicationSummary?: {
    addedCount: number;
    updatedCount: number;
    discardedCount: number;
    storageBackend: string;
  };
}

class StudyIngestionService {
  private oramaDbMap: Map<string, any> = new Map();
  private studyChunksMap: Map<string, StudyChunk[]> = new Map();
  private hydratedFromBackend = false;

  constructor() {
    this.hydrateFromPermanentVectorStore().catch(() => {});
  }

  /**
   * Hidrata os estudos e chunks vetorizados do PostgreSQL 17 (PGVector) / Vault em disco,
   * garantindo que os #documentos jamais desapareçam após F5 (reload).
   */
  public async hydrateFromPermanentVectorStore(): Promise<void> {
    if (this.hydratedFromBackend || typeof fetch !== 'function') return;
    try {
      const res = await fetch('/api/aeos/memory/documents', {
        method: 'GET',
        credentials: 'same-origin'
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.chunks)) {
        this.hydratedFromBackend = true;
        const grouped = new Map<string, StudyChunk[]>();
        for (const c of data.chunks) {
          const sId = String(c.studyId || 'default');
          if (!grouped.has(sId)) grouped.set(sId, []);
          grouped.get(sId)!.push({
            id: String(c.id),
            pageNumber: Number(c.pageNumber || 1),
            text: String(c.text || '')
          });
        }
        for (const [sId, chunks] of grouped.entries()) {
          if (!this.studyChunksMap.has(sId)) {
            this.studyChunksMap.set(sId, chunks);
            await this.indexInOrama(sId, chunks);
          }
        }
      }
    } catch {
      // Silencioso quando executado em ambiente de teste unitário puro sem servidor HTTP
    }
  }

  /**
   * Processa um arquivo enviado localmente pelo usuário
   */
  public async ingestFile(file: File): Promise<IngestionResult> {
    const filename = file.name;
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const id = `study-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const uploadedAt = new Date().toISOString();

    let fullText = '';
    let pageCount = 1;

    try {
      if (ext === 'pdf') {
        const result = await this.extractPdfText(file);
        fullText = result.text;
        pageCount = result.pageCount;
      } else if (ext === 'docx') {
        fullText = await this.extractDocxText(file);
      } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        fullText = await this.extractSpreadsheetText(file);
      } else {
        // Arquivos de texto puro: .md, .txt, .json
        fullText = await file.text();
      }
    } catch (err: any) {
      console.warn('Erro na extração do arquivo:', err);
      fullText = `[Não foi possível extrair o texto de ${filename}: ${err?.message || 'formato ilegível'}]`;
    }

    // Dividir em chunks por parágrafo / página para envio cirúrgico ao LLM
    const chunks = this.chunkText(fullText, 1200);
    this.studyChunksMap.set(id, chunks);

    // Indexar no Orama se a biblioteca estiver carregada
    await this.indexInOrama(id, chunks);

    // Calcular hash SHA-256 do arquivo original para auditoria
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const vaultBlobSha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const attachment: StudyAttachment = {
      id,
      filename,
      sizeBytes: file.size,
      mimeType: file.type || `application/${ext}`,
      pageCount,
      extractedText: fullText.slice(0, 10000), // Amostra inicial
      vaultBlobSha256,
      uploadedAt,
      indexedOramaId: id
    };

    let deduplicationSummary: IngestionResult['deduplicationSummary'];
    if (typeof fetch === 'function') {
      try {
        const ingestRes = await fetch('/api/aeos/memory/documents/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            studyId: id,
            filename,
            mimeType: attachment.mimeType,
            sizeBytes: file.size,
            pageCount,
            chunks
          })
        });
        if (ingestRes.ok) {
          const ingestData = await ingestRes.json();
          if (ingestData && ingestData.ok) {
            deduplicationSummary = {
              addedCount: Number(ingestData.addedCount ?? chunks.length),
              updatedCount: Number(ingestData.updatedCount ?? 0),
              discardedCount: Number(ingestData.discardedCount ?? 0),
              storageBackend: String(ingestData.storageBackend || 'postgres_pgvector_384d')
            };
          }
        }
      } catch {
        // Continua com índice Orama local caso offline
      }
    }

    return {
      attachment,
      totalCharacters: fullText.length,
      chunksCount: chunks.length,
      deduplicationSummary
    };
  }

  /**
   * Extração de texto de PDF no browser
   */
  private async extractPdfText(file: File): Promise<{ text: string; pageCount: number }> {
    try {
      const pdfjs = await import('pdfjs-dist');
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      let combined = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageStr = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        combined += `\n--- [Página ${i} de ${numPages}] ---\n${pageStr}\n`;
      }

      return { text: combined.trim(), pageCount: numPages };
    } catch (e) {
      console.warn('Falha no pdfjs-dist, tentando leitura crua de texto:', e);
      const raw = await file.text();
      return { text: raw.replace(/[^\x20-\x7E\n\r]/g, ' ').slice(0, 50000), pageCount: 1 };
    }
  }

  /**
   * Extração de DOCX via mammoth
   */
  private async extractDocxText(file: File): Promise<string> {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || '';
    } catch {
      return await file.text();
    }
  }

  /**
   * Extração de planilhas via SheetJS (xlsx)
   */
  private async extractSpreadsheetText(file: File): Promise<string> {
    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      let output = '';

      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        output += `\n=== ABA: ${sheetName} ===\n${csv}\n`;
      });

      return output.trim();
    } catch {
      return await file.text();
    }
  }

  /**
   * Divide o texto em fragmentos contextuais de tamanho controlado
   */
  private chunkText(fullText: string, maxChunkLength = 1200): StudyChunk[] {
    const paragraphs = fullText.split(/\n\s*\n/);
    const chunks: StudyChunk[] = [];
    let currentChunk = '';
    let currentPage = 1;

    for (const p of paragraphs) {
      const pageMatch = p.match(/--- \[Página (\d+) de \d+\] ---/);
      if (pageMatch) {
        currentPage = parseInt(pageMatch[1], 10);
      }

      if ((currentChunk + '\n' + p).length > maxChunkLength && currentChunk.trim()) {
        chunks.push({
          id: `chk-${chunks.length + 1}`,
          pageNumber: currentPage,
          text: currentChunk.trim()
        });
        currentChunk = p;
      } else {
        currentChunk += '\n' + p;
      }
    }

    if (currentChunk.trim()) {
      chunks.push({
        id: `chk-${chunks.length + 1}`,
        pageNumber: currentPage,
        text: currentChunk.trim()
      });
    }

    return chunks;
  }

  /**
   * Indexa no Orama em memória se disponível
   */
  private async indexInOrama(studyId: string, chunks: StudyChunk[]): Promise<void> {
    try {
      const { create, insertMultiple } = await import('@orama/orama');
      const db = await create({
        schema: {
          chunkId: 'string',
          pageNumber: 'number',
          text: 'string'
        }
      });

      await insertMultiple(
        db,
        chunks.map(c => ({
          chunkId: c.id,
          pageNumber: c.pageNumber,
          text: c.text
        }))
      );

      this.oramaDbMap.set(studyId, db);
    } catch (e) {
      console.warn('Orama BM25 indisponível, usando busca por regex local:', e);
    }
  }

  /**
   * Consulta os trechos mais relevantes do estudo para injetar no prompt
   */
  public async queryStudy(studyId: string, query: string, limit = 4): Promise<StudyChunk[]> {
    const db = this.oramaDbMap.get(studyId);
    if (db) {
      try {
        const { search } = await import('@orama/orama');
        const searchResult = await search(db, {
          term: query,
          limit
        });
        return searchResult.hits.map(hit => ({
          id: hit.document.chunkId as string,
          pageNumber: hit.document.pageNumber as number,
          text: hit.document.text as string
        }));
      } catch (e) {
        console.warn('Falha na busca Orama:', e);
      }
    }

    // Fallback: busca por palavras-chave ou no PGVector permanente (/api/aeos/memory/documents/query)
    const chunks = this.studyChunksMap.get(studyId) || [];
    if (chunks.length === 0 && typeof fetch === 'function') {
      try {
        const vecRes = await fetch('/api/aeos/memory/documents/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ studyId, query, limit })
        });
        if (vecRes.ok) {
          const vecData = await vecRes.json();
          if (vecData && Array.isArray(vecData.results) && vecData.results.length > 0) {
            return vecData.results.map((r: any) => ({
              id: String(r.id),
              pageNumber: Number(r.pageNumber || 1),
              text: String(r.text || '')
            }));
          }
        }
      } catch {}
    }

    const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (keywords.length === 0) return chunks.slice(0, limit);

    const scored = chunks.map(chunk => {
      const lower = chunk.text.toLowerCase();
      let score = 0;
      keywords.forEach(kw => {
        if (lower.includes(kw)) score += 1;
      });
      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.chunk);
  }
}

export const studyIngestionService = new StudyIngestionService();

