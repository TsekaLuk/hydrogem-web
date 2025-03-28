import { marked, MarkedOptions } from 'marked';
import hljs from 'highlight.js';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// 配置marked选项
marked.setOptions({
  highlight: function(code: string, lang: string | undefined) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return code;
  },
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // 自动转换换行符为<br>
  headerIds: true, // 为标题生成ID
  mangle: false, // 不对邮箱链接编码，避免显示问题
  pedantic: false, // 不严格遵循原始markdown规范
  sanitize: false, // 不净化输出，允许HTML标签
  smartLists: true, // 使用更智能的列表行为
  smartypants: true // 使用更智能的标点符号
} as MarkedOptions);

// 处理数学公式
const renderMath = (text: string, displayMode: boolean = false): string => {
  try {
    return katex.renderToString(text, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
      macros: {
        '\\vec': '\\mathbf',
        '\\mat': '\\mathbf',
      }
    });
  } catch (error) {
    console.error('KaTeX渲染错误:', error);
    return `<div class="katex-error">${text}</div>`;
  }
};

// 自定义渲染器
const renderer = new marked.Renderer();

// 增强标题渲染
renderer.heading = (text: string, level: number) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `
    <h${level} id="${escapedText}" class="markdown-heading heading-${level}">
      ${text}
    </h${level}>
  `;
};

// 增强表格渲染
renderer.table = (header: string, body: string) => {
  return `
    <div class="table-container">
      <table class="markdown-table">
        <thead>${header}</thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
};

// 增强引用块渲染
renderer.blockquote = (quote: string) => {
  return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
};

// 增强列表渲染
renderer.list = (body: string, ordered: boolean, start: number) => {
  const tag = ordered ? 'ol' : 'ul';
  const startAttr = ordered && start !== 1 ? ` start="${start}"` : '';
  const className = ordered ? 'markdown-ordered-list' : 'markdown-unordered-list';
  return `<${tag} class="${className}"${startAttr}>${body}</${tag}>`;
};

// 增强列表项渲染
renderer.listitem = (text: string) => {
  return `<li class="markdown-list-item">${text}</li>`;
};

// 增强水平线渲染
renderer.hr = () => {
  return `<hr class="markdown-hr" />`;
};

// 增强代码块渲染
renderer.code = (code: string, language: string | undefined) => {
  // 如果是数学公式块
  if (language === 'math' || language === 'tex') {
    return `<div class="katex-display-wrapper"><div class="katex-display">${renderMath(code, true)}</div></div>`;
  }

  // 普通代码块
  const validLang = Boolean(language && hljs.getLanguage(language));
  const highlighted = validLang ? hljs.highlight(code, { language: language!, ignoreIllegals: true }).value : code;
  const langClass = validLang ? `language-${language}` : '';
  
  return `
    <div class="code-block-container relative w-full rounded-lg bg-slate-900 p-4 font-mono text-sm">
      <div class="flex justify-between items-center py-2">
        ${language ? `<div class="text-xs font-medium text-zinc-300">${language}</div>` : ''}
        <button class="copy-code-button flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors font-sans">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
      </div>
      <pre class="hljs ${langClass}" style="margin:0;padding:0.5rem;background:transparent;font-size:1rem;line-height:1.5;font-family:Consolas,Monaco,'Andale Mono',monospace;color:rgba(255,255,255,0.95);font-weight:500;"><code>${highlighted}</code></pre>
    </div>
  `;
};

// 处理行内公式
renderer.text = (text: string) => {
  return text.replace(/\$([^\n$]*?)\$/g, (_, formula) => {
    return renderMath(formula, false);
  });
};

// 处理块级公式
renderer.paragraph = (text: string) => {
  // 处理块级公式
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
    return `<div class="katex-display-wrapper"><div class="katex-display">${renderMath(formula, true)}</div></div>`;
  });
  
  // 处理行内公式
  text = text.replace(/\$([^\n$]*?)\$/g, (_, formula) => {
    return `<span class="katex-inline katex-inline-fix">${renderMath(formula, false)}</span>`;
  });
  
  return `<p class="markdown-paragraph">${text}</p>`;
};

// 增强链接渲染
renderer.link = (href: string, title: string, text: string) => {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}" class="markdown-link" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
};

// 增强图片渲染
renderer.image = (href: string, title: string, text: string) => {
  const titleAttr = title ? ` title="${title}"` : '';
  const altAttr = text ? ` alt="${text}"` : '';
  return `<img src="${href}" class="markdown-image"${titleAttr}${altAttr} loading="lazy" />`;
};

// 增强强调渲染
renderer.strong = (text: string) => {
  return `<strong class="markdown-strong">${text}</strong>`;
};

renderer.em = (text: string) => {
  return `<em class="markdown-emphasis">${text}</em>`;
};

renderer.codespan = (text: string) => {
  // 检查是否为数学公式
  if (text.startsWith('$') && text.endsWith('$')) {
    const math = text.substring(1, text.length - 1);
    return renderMath(math, false);
  }
  return `<code class="markdown-code-inline">${text}</code>`;
};

// 导出渲染函数
export async function renderMarkdown(markdown: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const html = marked(markdown, { renderer });
      resolve(html);
    } catch (error) {
      console.error('Markdown渲染错误:', error);
      reject(error);
    }
  });
}