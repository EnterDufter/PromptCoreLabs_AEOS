/**
 * PCL AEOS Audio Engine - Text-to-Speech Markdown Sanitizer
 * Converte marcações Markdown sintáticas em prosa natural fluida para leitura por voz alta
 */

export function sanitizeMarkdownForSpeech(rawMarkdown: string): string {
  if (!rawMarkdown) return '';

  return rawMarkdown
    // 1. Remove blocos de código multi-linha, substituindo por aviso oratório natural
    .replace(/```[\s\S]*?```/g, ' Trecho de código omitido da leitura oral. ')
    
    // 2. Remove código inline `código` mantendo apenas o texto
    .replace(/`([^`]+)`/g, '$1')
    
    // 3. Remove negrito e itálico (**texto**, __texto__, *texto*, _texto_)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    
    // 4. Converte cabeçalhos (# Título) em pausas orais com ponto final
    .replace(/^#{1,6}\s+(.*)$/gm, '$1. ')
    
    // 5. Converte links markdown [texto](url) apenas para o rótulo legível
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    
    // 6. Converte referências a URLs puras para termo conciso
    .replace(/https?:\/\/\S+/g, 'link web')
    
    // 7. Converte marcadores de lista não-ordenada (-, *, •) em vírgulas com pausa natural
    .replace(/^\s*[-*•]\s+/gm, ', ')
    
    // 8. Normaliza listas numeradas
    .replace(/^\s*(\d+)\.\s+/gm, '$1. ')
    
    // 9. Remove delimitadores de tabela Markdown
    .replace(/\|[\s-:]+\|/g, ' ')
    .replace(/\|/g, ', ')
    
    // 10. Remove linhas horizontais e divisores
    .replace(/^[-*_]{3,}$/gm, '')
    
    // 11. Remove tags HTML residuais
    .replace(/<[^>]+>/g, ' ')
    
    // 12. Remove menções a tags (#Documento -> Documento)
    .replace(/(?<!\w)#(\w+)/g, '$1')
    
    // 13. Normaliza pontuação excessiva (ex: .., ,, ,.)
    .replace(/,\s*,+/g, ',')
    .replace(/\.\s*\.+/g, '.')
    .replace(/,\s*\./g, '.')
    
    // 14. Normaliza espaçamentos e quebras de linha
    .replace(/\s+/g, ' ')
    .trim();
}

