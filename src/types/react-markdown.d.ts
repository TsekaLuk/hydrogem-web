declare module 'react-markdown' {
  import React from 'react';
  
  export interface ReactMarkdownProps {
    children: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: Components;
    className?: string;
  }
  
  export interface Components {
    [key: string]: React.ComponentType<any>;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  export default ReactMarkdown;
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module 'rehype-highlight' {
  const rehypeHighlight: any;
  export default rehypeHighlight;
}

declare module 'react-syntax-highlighter' {
  import React from 'react';
  
  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    wrapLines?: boolean;
    showLineNumbers?: boolean;
    customStyle?: any;
    children: string;
  }
  
  export const Prism: React.ComponentType<SyntaxHighlighterProps>;
  export const Light: React.ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const vscDarkPlus: any;
  export const prism: any;
  export const dracula: any;
} 