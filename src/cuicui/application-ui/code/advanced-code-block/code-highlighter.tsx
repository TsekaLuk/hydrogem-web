import { memo, useEffect, useState } from "react";
import { getHighlighter, BundledLanguage, BundledTheme } from "shiki";

type ShikiCodeProps = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
};

const ShikiCode = memo(function ShikiCode({
  code,
  lang = "typescript",
  theme = "github-light",
}: ShikiCodeProps) {
  const [highlighted, setHighlighted] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function highlightCode() {
      try {
        const highlighter = await getHighlighter({
          langs: [lang],
          themes: [theme],
        });

        const html = highlighter.codeToHtml(code, {
          lang,
          theme,
        });

        setHighlighted(html);
        setLoading(false);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHighlighted(`<pre class="language-${lang}">${code}</pre>`);
        setLoading(false);
      }
    }

    highlightCode();
  }, [code, lang, theme]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-10 w-full dark:bg-gray-700"></div>;
  }

  return (
    <div
      className="language-shiki"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
});

export default ShikiCode; 