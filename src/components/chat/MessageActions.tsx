import { Copy, Check, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageActionsProps {
  content: string;
  onReply?: () => void;
}

export function MessageActions({ content, onReply }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 rounded-lg bg-background/50 hover:bg-background/80',
          'text-muted-foreground hover:text-foreground'
        )}
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      {onReply && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-7 w-7 rounded-lg bg-background/50 hover:bg-background/80',
            'text-muted-foreground hover:text-foreground'
          )}
          onClick={onReply}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}