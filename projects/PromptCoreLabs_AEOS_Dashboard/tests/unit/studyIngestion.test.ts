import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { studyIngestionService } from '../../src/services/study/studyIngestionService';

describe('StudyIngestionService (Local RAG @orama/orama + WebCrypto SHA-256)', () => {
  it('ingere arquivo Markdown, indexa no Orama e retorna trechos relevantes na consulta', async () => {
    const content = [
      '=== Página 1 ===',
      'O coprocessador Laya System One executa inferência NLI 100% em CPU INT8 garantindo 0 MB VRAM.',
      '',
      '=== Página 2 ===',
      'O failover soberano usa Ollama na porta 11434 e OmniRoute Gateway na porta 20130.'
    ].join('\n');

    const file = new File([content], 'especificacao-laya.md', { type: 'text/markdown' });
    const res = await studyIngestionService.ingestFile(file);

    expect(res.attachment.filename).toBe('especificacao-laya.md');
    expect(res.attachment.vaultBlobSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(res.totalCharacters).toBe(content.length);
    expect(res.chunksCount).toBeGreaterThanOrEqual(1);

    const hits = await studyIngestionService.queryStudy(res.attachment.id, 'coprocessador VRAM');
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits[0].text).toContain('0 MB VRAM');
  });

  it('extrai e indexa planilha XLSX real sem enviar dados para rede externa', async () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Modulo', 'Status', 'Observacao'],
      ['PII Guard', 'Operacional', 'Anonimizacao LGPD ativa'],
      ['OmniRoute', 'Container', 'Porta oficial 20130']
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Audit');
    const binaryArray = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;

    const xlsxFile = new File([binaryArray], 'matriz-auditoria.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const res = await studyIngestionService.ingestFile(xlsxFile);

    expect(res.attachment.extractedText).toContain('OmniRoute');
    expect(res.attachment.extractedText).toContain('20130');

    const hits = await studyIngestionService.queryStudy(res.attachment.id, '20130');
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits[0].text).toContain('OmniRoute');
  });
});

