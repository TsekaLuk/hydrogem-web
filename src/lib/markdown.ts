import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { parseLatex } from './katex-config';
import { renderMathJax } from './mathjax-init';

// 标记已处理过数学公式的文本
const processedTexts = new Set<string>();

// 预处理markdown内容，处理块级公式
function preprocessMarkdown(content: string): string {
  if (!content) return '';
  
  // 检测并特殊处理块级公式
  return content.replace(/(\$\$[\s\S]+?\$\$)/g, (match) => {
    // 为块级公式添加特殊标记，确保它们在完整的段落中
    return `\n\n${match}\n\n`;
  });
}

// Configure syntax highlighting for code blocks
marked.use(
  markedHighlight({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          console.error(err);
        }
      }
      return code;
    },
  })
);

// Create a custom renderer to handle math expressions
const renderer = new marked.Renderer();
const originalParagraph = renderer.paragraph.bind(renderer);

// Override paragraph renderer to process LaTeX in markdown
renderer.paragraph = (text) => {
  // 检查是否为纯块级公式段落
  if (/^\s*\$\$([\s\S]+?)\$\$\s*$/.test(text)) {
    // 对于复杂公式使用MathJax，简单公式使用KaTeX
    return hasComplexMath(text) ? 
      `<div class="math-block" data-math-type="mathjax">${text}</div>` : 
      parseLatex(text);
  }
  
  // 处理普通段落中的LaTeX (主要是行内公式)
  const processedText = hasComplexMath(text) ? 
    processComplexInlineMath(text) : 
    parseLatex(text);
  return originalParagraph(processedText);
};

// 处理复杂内联数学表达式的函数
function processComplexInlineMath(text: string): string {
  // 标记内联公式以便客户端渲染，添加特定的类以确保行内渲染
  return text.replace(/\$([^\$]+?)\$/g, (match, formula) => {
    if (hasComplexMath(formula)) {
      return `<span class="math-inline math-inline-fix" data-math-type="mathjax">${match}</span>`;
    }
    return match; // 简单公式由parseLatex处理
  });
}

// Process LaTeX inside all text elements
marked.use({
  renderer,
  walkTokens: (token) => {
    // 对于text类型的token，仅处理不包含块级公式的情况
    if (token.type === 'text' && !token.text.includes('$$')) {
      token.text = parseLatex(token.text);
    }
  }
});

// Create a unified processor for simple math expressions
const simpleProcessor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify);

// Detect complex math expressions that should use MathJax
const hasComplexMath = (content: string): boolean => {
  const complexPatterns = [
    /\\begin\{(align|gather|multline|eqnarray)\*?\}/,  // Complex environments
    /\\underbrace|\\overbrace/,                        // Under/overbrace
    /\\xleftarrow|\\xrightarrow/,                      // Extensible arrows
    /\\begin\{cases\}.{100,}/,                        // Large cases environment
    /\\begin\{(matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}.{150,}/, // Large matrices
    /\\mathchoice/,                                   // Math choice command
    /\\(over|under)set/,                              // Over/under set
    /\\stackrel/,                                     // Stack relation
    /\\(mathop|limits)/,                              // Custom operators with limits
    /\\(left|right)\s*[\{\[].+?[\}\]]/s              // Complex delimiters
  ];
  
  return complexPatterns.some(pattern => pattern.test(content));
};

export async function renderMarkdown(content: string): Promise<string> {
  if (!content) return '';
  
  try {
    // 预处理markdown内容
    const preprocessed = preprocessMarkdown(content);
    
    // 使用simple processor作为基础处理
    const result = await simpleProcessor.process(preprocessed);
    
    // 结果转为字符串
    let htmlContent = String(result);
    
    // 处理标记为MathJax的元素（替换为实际渲染用的类和标签）
    htmlContent = htmlContent
      .replace(/<div class="math-block" data-math-type="mathjax">(\$\$[\s\S]+?\$\$)<\/div>/g, 
        (_, formula) => `<div class="math-display-mathjax">${formula}</div>`)
      .replace(/<span class="math-inline" data-math-type="mathjax">(\$[\s\S]+?\$)<\/span>/g,
        (_, formula) => `<span class="math-inline-mathjax math-inline-fix">${formula}</span>`)
      .replace(/<span class="math-inline math-inline-fix" data-math-type="mathjax">(\$[\s\S]+?\$)<\/span>/g,
        (_, formula) => `<span class="math-inline-mathjax math-inline-fix">${formula}</span>`);
    
    // 清理处理过程中可能引入的额外标签
    return htmlContent
      .replace(/<p>\s*<\/p>/g, '') // 移除空段落
      .replace(/<br>\s*\$\$/g, '$$') // 修复块级公式前的<br>标签
      .replace(/\$\$\s*<br>/g, '$$'); // 修复块级公式后的<br>标签
  } catch (error) {
    console.error('Error rendering markdown:', error);
    
    // 如果统一处理失败，回退到marked
    return marked.parse(preprocessMarkdown(content), {
      breaks: true,
      gfm: true,
      async: false
    }) as string;
  }
}