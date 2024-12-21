import { useState, useRef, useEffect, useCallback } from 'react';
import { SendHorizontal, Paperclip, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FileUploadButton } from './FileUploadButton';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

interface FileUpload {
  file: File;
  progress: number;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const simulateUpload = useCallback((file: File) => {
    setIsUploading(true);
    setUploads(prev => [...prev, { file, progress: 0 }]);

    const interval = setInterval(() => {
      setUploads(prev => {
        const newUploads = [...prev];
        const uploadIndex = newUploads.findIndex(u => u.file === file);
        
        if (uploadIndex === -1) return prev;
        
        const upload = newUploads[uploadIndex];
        if (upload.progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add file reference to input
          const fileType = file.type.startsWith('image/') ? 'image' : 'file';
          const markdown = fileType === 'image' 
            ? `\n![${file.name}](${URL.createObjectURL(file)})\n`
            : `\n[${file.name}](${URL.createObjectURL(file)})\n`;
          
          setInput(prev => prev + markdown);
          return prev.filter(u => u.file !== file);
        }

        newUploads[uploadIndex] = {
          ...upload,
          progress: Math.min(100, upload.progress + 10)
        };
        return newUploads;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = (file: File) => {
    simulateUpload(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isUploading) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative backdrop-blur-xl p-2 sm:p-4 z-20">
      <div className="relative flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.inputPlaceholder')}
            className={cn(
              "pr-12 resize-none text-sm sm:text-base",
              "bg-background/50 backdrop-blur-sm transition-all",
              "focus:bg-background/80 relative rounded-xl mb-2",
              "border-muted placeholder:text-muted-foreground/50",
              "min-h-[60px] max-h-[200px] overflow-y-auto"
            )}
            disabled={isLoading || isUploading}
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            <FileUploadButton
              icon={<Paperclip className="h-4 w-4" />}
              tooltip={t('chat.attachFile')}
              onFileSelect={handleFileSelect}
              disabled={isLoading || isUploading}
            />
            <FileUploadButton
              icon={<Image className="h-4 w-4" />}
              tooltip={t('chat.addImage')}
              onFileSelect={handleFileSelect}
              isImage
              disabled={isLoading || isUploading}
            />
          </div>
        </div>
        <Button
          size="icon"
          type="submit"
          disabled={!input.trim() || isLoading || isUploading}
          className={cn(
            'h-[40px] w-[40px] rounded-xl',
            'bg-primary hover:bg-primary/90',
            'transition-all duration-200',
            'hover:scale-105',
            (isLoading || isUploading) && 'animate-pulse',
            'mb-2'  // Add margin-bottom to move button up
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
          <span className="sr-only">{t('chat.send')}</span>
        </Button>
      </div>
      {uploads.length > 0 && (
        <div className="mt-2 space-y-2">
          {uploads.map((upload) => (
            <div key={upload.file.name} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground truncate flex-1">
                {upload.file.name}
              </span>
              <Progress value={upload.progress} className="w-24" />
            </div>
          ))}
        </div>
      )}
    </form>
  );
}