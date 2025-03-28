import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/cuicui/utils/cn";

interface CopyToClipboardProps {
  code: string;
  className?: string;
}

export default function CopyToClipboard({ code, className }: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className={cn(
        "group/button relative z-10 h-8 w-8 rounded-lg border border-white/20 bg-white/10 backdrop-blur transition",
        "flex items-center justify-center",
        "hover:bg-white/20 active:scale-95",
        "dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30",
        className
      )}
      onClick={copy}
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-emerald-500 transition dark:text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4 text-neutral-500 transition group-hover/button:text-neutral-700 dark:text-neutral-400 dark:group-hover/button:text-neutral-300" />
      )}
    </button>
  );
} 