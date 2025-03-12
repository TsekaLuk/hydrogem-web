declare module 'remark-math' {
  const remarkMath: any;
  export default remarkMath;
}

declare module 'rehype-katex' {
  const rehypeKatex: any;
  export default rehypeKatex;
}

declare module 'rehype-mathjax' {
  const rehypeMathJax: any;
  export default rehypeMathJax;
}

declare module 'rehype-stringify' {
  const rehypeStringify: any;
  export default rehypeStringify;
}

declare module 'unified' {
  interface Processor {
    use: (plugin: any, ...options: any[]) => Processor;
    process: (content: string) => Promise<{ toString: () => string }>;
  }
  
  export function unified(): Processor;
}

declare module 'remark-parse' {
  const remarkParse: any;
  export default remarkParse;
}

declare module 'remark-rehype' {
  const remarkRehype: any;
  export default remarkRehype;
} 