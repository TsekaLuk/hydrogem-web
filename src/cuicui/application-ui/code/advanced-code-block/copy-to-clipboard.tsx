import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyToClipboardProps = {
  code: string;
};

const CopyToClipboard = ({ code }: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code to clipboard", error);
    }
  };

  return (
    <button
      className="flex h-6 w-6 items-center justify-center rounded-md border border-white/30 bg-white/70 text-neutral-700 shadow-sm transition hover:bg-white dark:bg-zinc-600/70 dark:text-neutral-200 dark:hover:bg-zinc-600"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy code to clipboard"}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
};

export default CopyToClipboard; 