import { describe, it, expect } from 'vitest';
import { piiGuardService } from '../../src/services/security/piiGuardService';

describe('PIIGuardService', () => {
  it('mascara CPF, CNPJ, e-mail e API keys mantendo estrutura de texto', () => {
    const fakeOpenAiKey = 'sk-' + 'abcd1234'.repeat(5);
    const fakeGhToken = 'ghp_' + 'xyz987654321'.repeat(4);
    const rawPrompt = `Solicitante João CPF 123.456.789-01, empresa CNPJ 12.345.678/0001-99, contato admin@empresa.com.br, chaves ${fakeOpenAiKey} e ${fakeGhToken}.`;

    const result = piiGuardService.sanitizePrompt(rawPrompt);

    expect(result.redactedFieldsCount).toBeGreaterThanOrEqual(5);
    expect(result.detectedTypes).toEqual(
      expect.arrayContaining(['CPF', 'CNPJ', 'Email', 'API Key / Secret'])
    );
    expect(result.sanitizedText).not.toContain('123.456.789-01');
    expect(result.sanitizedText).not.toContain('12.345.678/0001-99');
    expect(result.sanitizedText).not.toContain('admin@empresa.com.br');
    expect(result.sanitizedText).not.toContain(fakeOpenAiKey);
    expect(result.sanitizedText).not.toContain(fakeGhToken);
    expect(result.sanitizedText).toContain('[REDACTED_CPF]');
    expect(result.sanitizedText).toContain('[REDACTED_CNPJ]');
    expect(result.sanitizedText).toContain('[REDACTED_EMAIL]');
    expect(result.sanitizedText).toContain('[REDACTED_API_KEY]');
  });

  it('retorna contagem zero e preserva texto limpo sem falsos positivos', () => {
    const clean = 'Compare o consumo de GPU em BERT e Qwen 2.5 em latência p95.';
    const result = piiGuardService.sanitizePrompt(clean);

    expect(result.redactedFieldsCount).toBe(0);
    expect(result.detectedTypes).toEqual([]);
    expect(result.sanitizedText).toBe(clean);
  });
});

