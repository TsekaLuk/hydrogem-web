import { useEffect, useState } from "react";
import { getHighlighter, BundledLanguage, BundledTheme, Highlighter } from "shiki";

interface ShikiCodeProps {
  code: string;
  lang: BundledLanguage;
  theme: BundledTheme;
}

// 单例模式缓存高亮器实例
let highlighterPromise: Promise<Highlighter> | null = null;

const getShikiHighlighter = async (theme: BundledTheme) => {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: [theme, "github-dark"],
      langs: ["javascript", "typescript", "jsx", "tsx", "json", "html", "css", "python", "bash", "markdown"],
    });
  }
  return highlighterPromise;
};

export default function ShikiCode({ code, lang, theme }: ShikiCodeProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 设置初始加载状态
    setIsLoading(true);

    const highlight = async () => {
      try {
        const highlighter = await getShikiHighlighter(theme);
        const html = highlighter.codeToHtml(code, {
          lang: lang || "typescript",
          theme: theme
        });
        setHighlightedCode(html);
        setIsLoading(false);
      } catch (error) {
        console.error("Shiki highlighting error:", error);
        // 回退到简单的转义显示
        setHighlightedCode(`<pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`);
        setIsLoading(false);
      }
    };

    highlight();
  }, [code, lang, theme]);

  if (isLoading) {
    return (
      <div className="flex animate-pulse items-center justify-center p-4 text-neutral-400">
        <div className="h-4 w-1/3 rounded bg-neutral-300 dark:bg-neutral-700"></div>
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
} 