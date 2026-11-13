import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';
import {
  calculateSha256,
  extractEmbeddedArtifacts,
  generateArtifactsFromInteraction,
  buildCortexArchitectureSvg,
  buildExecutiveInfographicDataUri
} from '../../src/services/artifacts/artifactGeneratorService';
import { sanitizeMarkdownForSpeech } from '../../src/services/audio/ttsSanitizer';

describe('Artifact Generator & Export Pipelines', () => {
  it('extrai diagrama Mermaid, aplicação HTML5 e planilha Markdown (.xlsx) de resposta LLM', () => {
    const sampleReply = [
      'Segue análise consolidada:',
      '```mermaid',
      'flowchart LR',
      '  A["Usuário"] --> B["Cortex Gateway"]',
      '```',
      '',
      '```html',
      '<div style="padding:16px"><h1>Painel FinOps</h1><p>Dados em tempo real</p></div>',
      '```',
      '',
      '| Serviço | Porta | Latência |',
      '| :--- | :--- | :--- |',
      '| OmniRoute | :20130 | 18ms |',
      '| Laya CPU | :20140 | 24ms |'
    ].join('\n');

    const artifacts = extractEmbeddedArtifacts(sampleReply, 'Arquitetura PCL');

    expect(artifacts.some(a => a.type === 'diagram' && a.formatExt === '.svg')).toBe(true);
    expect(artifacts.some(a => a.type === 'app' && a.formatExt === '.html')).toBe(true);
    expect(artifacts.some(a => a.type === 'sheet' && a.formatExt === '.xlsx')).toBe(true);
  });

  it('gera SHA-256 determinístico e artefato sob demanda para slides (.pptx)', async () => {
    const hash1 = await calculateSha256('PromptCore Labs Test');
    const hash2 = await calculateSha256('PromptCore Labs Test');
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBeGreaterThanOrEqual(16);

    const artifacts = await generateArtifactsFromInteraction(
      'Crie uma apresentação pitch deck sobre FinOps',
      'Resumo executivo sobre economia de $0.00 em inferência soberana.',
      'slide'
    );
    expect(artifacts.length).toBeGreaterThanOrEqual(1);
    expect(artifacts[0].formatExt).toBe('.pptx');
    expect(artifacts[0].vaultBlobSha256).toBeTruthy();
  });

  it('gera binários válidos reais de Excel (.xlsx) e PowerPoint (.pptx)', async () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Métrica', 'Valor'],
      ['VRAM Laya', '0 MB'],
      ['Custo Local', '$0.00']
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Resumo');
    const xlsxBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
    expect(xlsxBuf.length).toBeGreaterThan(500);
    // Assinatura PKZIP (XLSX/PPTX)
    expect(xlsxBuf.subarray(0, 2).toString('utf8')).toBe('PK');

    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addText('PCL Cockpit Verification Deck', { x: 1, y: 1, fontSize: 18 });
    const pptxOut = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;
    expect(pptxOut.length).toBeGreaterThan(1000);
    expect(pptxOut.subarray(0, 2).toString('utf8')).toBe('PK');
  });

  it('sanitiza Markdown para leitura TTS sem símbolos brutos e constrói SVGs válidos', () => {
    const rawMd = '## Resumo **Executivo**\n- Confira `laya_health` em [Docs](https://example.com)\n```ts\nconst x = 1;\n```';
    const speech = sanitizeMarkdownForSpeech(rawMd);

    expect(speech).not.toContain('**');
    expect(speech).not.toContain('```');
    expect(speech).toContain('Resumo Executivo.');
    expect(speech).toContain('Trecho de código omitido da leitura oral.');

    expect(buildCortexArchitectureSvg('Teste').startsWith('<svg')).toBe(true);
    expect(buildExecutiveInfographicDataUri().startsWith('data:image/svg+xml;utf8,')).toBe(true);
  });
});

