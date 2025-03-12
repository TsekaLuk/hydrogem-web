import React, { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import mk from '@vscode/markdown-it-katex';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

interface KatexMarkdownProps {
  markdown: string;
  className?: string;
}

// Initialize markdown-it with KaTeX plugin
const md: MarkdownIt = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// Add KaTeX plugin with custom macros
md.use(mk, {
  macros: {
    // Define common differential operators with proper formatting
    "\\d": "\\mathrm{d}",
    "\\dx": "\\mathrm{d}x",
    "\\dy": "\\mathrm{d}y",
    "\\dz": "\\mathrm{d}z",
    "\\dt": "\\mathrm{d}t",
    // Define proper spacing commands
    "\\,": "\\,",
    "\\;": "\\;"
  }
});

// Preprocessing function for LaTeX expressions
function preprocessLatex(content: string): string {
  // Replace \[...\] with $$...$$
  content = content.replace(/\\\[(.+?)\\\]/gs, "$$" + "$1" + "$$");
  
  // Replace \(...\) with $...$
  content = content.replace(/\\\((.+?)\\\)/g, "$" + "$1" + "$");
  
  // Fix integral expressions - ensure proper formatting of dx, dy, etc.
  // Match integral expressions and add proper spacing before differentials
  content = content.replace(/\\int_([^}]+)}^{([^}]+)}([^,]+),\s*(d[xyztu])/g, '\\int_{$1}^{$2}$3\\,\\mathrm{$4}');
  content = content.replace(/\\int_([^}]+)}([^,]+),\s*(d[xyztu])/g, '\\int_{$1}$2\\,\\mathrm{$3}');
  content = content.replace(/\\int([^,]+),\s*(d[xyztu])/g, '\\int$1\\,\\mathrm{$2}');
  
  // Handle standard integrals with direct dx notation
  content = content.replace(/([^\\])\s+d([xyztu])/g, '$1\\,\\mathrm{d}$2');
  
  // Handle commas before differentials - replace with proper spacing
  content = content.replace(/,\s*(d[xyztu])/g, '\\,\\mathrm{$1}');
  
  // Handle standalone differentials - ensure proper formatting
  content = content.replace(/\b(d[xyztu])\b(?![\}\)])/g, (match, p1) => {
    if (content.includes(`\\mathrm{${p1}}`)) {
      return match;
    }
    return `\\mathrm{${p1}}`;
  });
  
  // Fix common spacing issues in LaTeX expressions
  content = content.replace(/([^\\])\\([a-zA-Z]+)\s+/g, '$1\\$2 ');
  
  return content;
}

const KatexMarkdown: React.FC<KatexMarkdownProps> = ({ markdown, className }) => {
  const [renderedContent, setRenderedContent] = useState<string>('');
  
  useEffect(() => {
    if (markdown) {
      try {
        // Preprocess the content
        const preprocessed = preprocessLatex(markdown);
        
        // Render the content
        const rendered = md.render(preprocessed);
        
        setRenderedContent(rendered);
      } catch (error) {
        console.error('Error rendering LaTeX:', error);
        // Fallback to displaying the raw markdown
        setRenderedContent(`<pre>${markdown}</pre>`);
      }
    }
  }, [markdown]);
  
  return (
    <div 
      className={`katex-markdown-container ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

export default KatexMarkdown; 