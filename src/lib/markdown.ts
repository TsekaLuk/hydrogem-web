import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

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

export function renderMarkdown(content: string): string {
  return marked(content, {
    breaks: true,
    gfm: true,
  });
}