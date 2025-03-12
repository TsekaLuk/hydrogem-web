import katex from 'katex';

export interface KatexOptions extends katex.KatexOptions {
  // Add any additional options here
}

export const defaultKatexOptions: KatexOptions = {
  throwOnError: false,
  errorColor: '#f44336',
  strict: false,
  trust: true,
  macros: {
    // Add any custom macros here
    "\\RR": "\\mathbb{R}",
    "\\NN": "\\mathbb{N}",
    "\\ZZ": "\\mathbb{Z}",
    "\\QQ": "\\mathbb{Q}",
    "\\CC": "\\mathbb{C}",
    // 添加专门处理逗号空格的宏
    ",\\": "{,\\,}",
    ", ": "{,\\;}",     // 处理逗号空格
    ",": "{,\\,}",      // 确保逗号被正确处理，添加一个小空格
    // 微分符号处理
    "\\d": "\\mathrm{d}",
    "dx": "{\\mathrm{d}x}",  // 改进微分符号的显示
    "dy": "{\\mathrm{d}y}",
    "dz": "{\\mathrm{d}z}",
    "dt": "{\\mathrm{d}t}",
    // 积分专用宏，确保正确间距
    "\\diff": "\\,\\mathrm{d}",
    "\\diffx": "\\,\\mathrm{d}x",
    "\\diffy": "\\,\\mathrm{d}y",
    "\\diffz": "\\,\\mathrm{d}z",
    "\\difft": "\\,\\mathrm{d}t",
  },
};

// 预处理函数，用于处理特殊情况
function preprocessLatex(content: string): string {
  // Replace \[...\] with $$...$$
  content = content.replace(/\\\[(.+?)\\\]/gs, "$$$1$$");
  
  // Replace \(...\) with $...$
  content = content.replace(/\\\((.+?)\\\)/g, "$$1$");
  
  // Fix integral expressions - ensure proper formatting of dx, dy, etc.
  content = content.replace(/\\int_([^}]+)}^{([^}]+)}([^,]+),\s*(d[xyztu])/g, '\\int_{$1}^{$2}$3\\,\\mathrm{$4}');
  content = content.replace(/\\int_([^}]+)}([^,]+),\s*(d[xyztu])/g, '\\int_{$1}$2\\,\\mathrm{$3}');
  content = content.replace(/\\int([^,]+),\s*(d[xyztu])/g, '\\int$1\\,\\mathrm{$2}');
  
  // Handle standard integrals with direct dx notation
  content = content.replace(/([^\\])\s+d([xyztu])/g, '$1\\,\\mathrm{d}$2');
  
  // Handle commas before differentials - replace with proper spacing and braces
  content = content.replace(/,\s*(d[xyztu])\b/g, '\\,\\mathrm{$1}');
  
  // Handle standalone differentials - ensure proper formatting without nesting
  content = content.replace(/\b(d[xyztu])\b(?![}\)])/g, '\\mathrm{$1}');
  
  // Ensure proper spacing between function and differential
  content = content.replace(/([a-zA-Z0-9\)])\s*\\mathrm\{(d[xyztu])\}/g, '$1\\,\\mathrm{$2}');
  
  return content;
}

// 移除块级公式周围可能出现的HTML标签
function cleanDisplayMathDelimiters(text: string): string {
  // 查找块级公式标记 $$ ... $$ 并清理周围的HTML标签
  return text.replace(/(<\s*br\s*\/*\s*>)*\$\$([\s\S]+?)\$\$(<\s*br\s*\/*\s*>)*/g, '$$$$2$$');
}

// 检测文本是否纯块级公式
function isKatexBlockOnly(text: string): boolean {
  // 如果文本去除空白后只包含一个块级公式，则返回true
  return /^\s*\$\$([\s\S]+?)\$\$\s*$/.test(text);
}

// This function can be used for parsing LaTeX in strings
export function parseLatex(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  try {
    // 首先清理块级公式周围的HTML标签
    text = cleanDisplayMathDelimiters(text);
    
    // 如果是纯块级公式文本，直接处理整体
    if (isKatexBlockOnly(text)) {
      const matches = text.match(/\$\$([\s\S]+?)\$\$/);
      if (matches && matches[1]) {
        try {
          const processedMath = preprocessLatex(matches[1].trim());
          return katex.renderToString(processedMath, {
            ...defaultKatexOptions,
            displayMode: true,
          });
        } catch (e) {
          console.error('KaTeX display error:', e);
          return `<div class="katex-error" title="${e}">${text}</div>`;
        }
      }
    }
    
    // Matches inline math delimited by $ ... $
    // but not if preceded by a backslash or another $
    text = text.replace(/(?<!\$|\\)\$(?!\$)(.+?)(?<!\$|\\)\$(?!\$)/g, (_, math) => {
      try {
        const processedMath = preprocessLatex(math.trim());
        return katex.renderToString(processedMath, {
          ...defaultKatexOptions,
          displayMode: false,
        });
      } catch (e) {
        console.error('KaTeX inline error:', e);
        return `<span class="katex-error" title="${e}">\$${math}\$</span>`;
      }
    });

    // Matches display math delimited by $$ ... $$
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        const processedMath = preprocessLatex(math.trim());
        return katex.renderToString(processedMath, {
          ...defaultKatexOptions,
          displayMode: true,
        });
      } catch (e) {
        console.error('KaTeX display error:', e);
        return `<div class="katex-error" title="${e}">\$\$${math}\$\$</div>`;
      }
    });

    return text;
  } catch (e) {
    console.error('LaTeX parsing error:', e);
    return text;
  }
} 