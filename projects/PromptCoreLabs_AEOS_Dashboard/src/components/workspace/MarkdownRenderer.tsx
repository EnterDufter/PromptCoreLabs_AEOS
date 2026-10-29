import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { renderOfficialLogo } from '../common/AppOfficialLogos';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper para formatar texto inline (suporta <br>, negrito, itálico, código inline, menções @ e #)
  const renderInlineFormatted = (rawText: string): React.ReactNode => {
    if (/<br\s*\/?>/i.test(rawText)) {
      const segments = rawText.split(/<br\s*\/?>/i);
      return segments.map((seg, sIdx) => (
        <React.Fragment key={sIdx}>
          {sIdx > 0 && <br />}
          {renderInlineTokens(seg)}
        </React.Fragment>
      ));
    }
    return renderInlineTokens(rawText);
  };

  const renderInlineTokens = (text: string) => {
    // Regex que identifica tokens inline:
    // 1. Código inline: `código`
    // 2. Negrito: **texto** ou __texto__
    // 3. Itálico: *texto* ou _texto_
    // 4. Menções @: @SAP, @Salesforce, @HubSpot, @Gmail, etc.
    // 5. Tags/Docs #: #Auditoria, etc. (apenas # único seguido de letra)
    const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|@[A-Za-z0-9_-]+|(?<!#)#[A-Za-z][A-Za-z0-9_-]*)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

      // Código Inline
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 mx-0.5 rounded font-mono text-[12px] bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 border border-slate-200 dark:border-slate-700/80 font-medium"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Negrito
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        return (
          <strong key={idx} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Itálico
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        return (
          <em key={idx} className="italic text-slate-800 dark:text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Menção com Logo Oficial (@App)
      if (part.startsWith('@')) {
        const appKey = part.slice(1).toLowerCase();
        const logo = renderOfficialLogo(appKey, 'w-3.5 h-3.5 object-contain inline-block');
        if (logo) {
          return (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 px-1.5 py-0.5 mx-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 text-[12px] font-semibold text-slate-800 dark:text-slate-100 shadow-xs align-baseline"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">{logo}</span>
              <span>{part.slice(1)}</span>
            </span>
          );
        }
        return (
          <span key={idx} className="font-semibold text-sky-600 dark:text-sky-400">
            {part}
          </span>
        );
      }

      // Menção a Documento (#Doc)
      if (part.startsWith('#')) {
        return (
          <span
            key={idx}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono text-[11px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium"
          >
            {part}
          </span>
        );
      }

      return part;
    });
  };

  // Parser principal de blocos
  const renderBlocks = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let blockKey = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 1. Bloco de Código Multi-linha (```lang ... ```)
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim() || 'bash';
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        const fullCode = codeLines.join('\n');
        const currBlockIndex = blockKey++;

        elements.push(
          <div
            key={`code-${currBlockIndex}`}
            className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-lg text-xs"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center space-x-1.5 uppercase font-semibold text-slate-300">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>{lang}</span>
              </span>
              <button
                onClick={() => handleCopyCode(fullCode, currBlockIndex)}
                className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
                title="Copiar código"
              >
                {copiedIndex === currBlockIndex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-medium">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Copiar</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto font-mono text-[12px] leading-relaxed custom-scrollbar text-emerald-300/90">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        continue;
      }

      // 2. Tabelas Markdown (| col1 | col2 |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCols = tableLines[0]
            .split('|')
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
            .map(c => c.trim());

          // Checa se a segunda linha é delimitadora (|---|---|)
          const isDelimiter = tableLines[1].includes('---');
          const bodyRowStartIndex = isDelimiter ? 2 : 1;

          const bodyRows = tableLines.slice(bodyRowStartIndex).map(rowStr =>
            rowStr
              .split('|')
              .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
              .map(c => c.trim())
          );

          elements.push(
            <div key={`table-${blockKey++}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80">
                    {headerCols.map((col, idx) => (
                      <th key={idx} className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100">
                        {renderInlineFormatted(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/50">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                          {renderInlineFormatted(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 3. Separadores Horizontais (--- ou ***)
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
        elements.push(
          <hr key={`hr-${blockKey++}`} className="my-3 border-slate-200 dark:border-slate-800" />
        );
        i++;
        continue;
      }

      // 3b. Títulos (#, ##, ###, ####, #####)
      const headingMatch = line.trim().match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const headingText = headingMatch[2];
        if (level === 1) {
          elements.push(
            <h2 key={`h1-${blockKey++}`} className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
              {renderInlineFormatted(headingText)}
            </h2>
          );
        } else if (level === 2) {
          elements.push(
            <h3 key={`h2-${blockKey++}`} className="text-sm font-bold text-slate-900 dark:text-white mt-3.5 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              {renderInlineFormatted(headingText)}
            </h3>
          );
        } else if (level === 3) {
          elements.push(
            <h4 key={`h3-${blockKey++}`} className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mt-3 mb-1">
              {renderInlineFormatted(headingText)}
            </h4>
          );
        } else {
          elements.push(
            <h5 key={`h4-${blockKey++}`} className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-2.5 mb-1">
              {renderInlineFormatted(headingText)}
            </h5>
          );
        }
        i++;
        continue;
      }

      // 4. Listas não-ordenadas (-, *, •)
      if (/^(\s*[-*•])\s+/.test(line)) {
        const bulletMatch = line.match(/^(\s*[-*•])\s+(.*)/);
        if (bulletMatch) {
          elements.push(
            <div key={`li-${blockKey++}`} className="flex items-start space-x-2 my-1 text-slate-700 dark:text-slate-200 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-2 flex-shrink-0" />
              <div className="flex-1 leading-relaxed">{renderInlineFormatted(bulletMatch[2])}</div>
            </div>
          );
          i++;
          continue;
        }
      }

      // 5. Listas numeradas (1., 2., etc.)
      if (/^(\s*\d+\.)\s+/.test(line)) {
        const numMatch = line.match(/^(\s*(\d+)\.)\s+(.*)/);
        if (numMatch) {
          elements.push(
            <div key={`num-${blockKey++}`} className="flex items-start space-x-2 my-1 text-slate-700 dark:text-slate-200 pl-1">
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0 min-w-[16px]">
                {numMatch[2]}.
              </span>
              <div className="flex-1 leading-relaxed">{renderInlineFormatted(numMatch[3])}</div>
            </div>
          );
          i++;
          continue;
        }
      }

      // 6. Linhas em branco
      if (!line.trim()) {
        elements.push(<div key={`empty-${blockKey++}`} className="h-1.5" />);
        i++;
        continue;
      }

      // 7. Parágrafos comuns
      elements.push(
        <p key={`p-${blockKey++}`} className="leading-relaxed my-1 text-slate-700 dark:text-slate-200">
          {renderInlineFormatted(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  return <div className={`markdown-body text-[13px] ${className}`}>{renderBlocks()}</div>;
};
