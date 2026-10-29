export interface SanitizationResult {
  originalText: string;
  sanitizedText: string;
  redactedFieldsCount: number;
  detectedTypes: string[];
}

class PIIGuardService {
  private patterns = [
    { type: 'CPF', regex: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b\d{11}\b/g, mask: '[REDACTED_CPF]' },
    { type: 'CNPJ', regex: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g, mask: '[REDACTED_CNPJ]' },
    { type: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, mask: '[REDACTED_EMAIL]' },
    { type: 'Cartão de Crédito', regex: /\b(?:\d[ -]*?){13,16}\b/g, mask: '[REDACTED_CARD]' },
    { type: 'API Key / Secret', regex: /\b(?:sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36,})\b/g, mask: '[REDACTED_API_KEY]' }
  ];

  public sanitizePrompt(input: string): SanitizationResult {
    let sanitizedText = input;
    let redactedFieldsCount = 0;
    const detectedTypes: string[] = [];

    this.patterns.forEach(p => {
      const matches = sanitizedText.match(p.regex);
      if (matches && matches.length > 0) {
        redactedFieldsCount += matches.length;
        if (!detectedTypes.includes(p.type)) {
          detectedTypes.push(p.type);
        }
        sanitizedText = sanitizedText.replace(p.regex, p.mask);
      }
    });

    return {
      originalText: input,
      sanitizedText,
      redactedFieldsCount,
      detectedTypes
    };
  }
}

export const piiGuardService = new PIIGuardService();
