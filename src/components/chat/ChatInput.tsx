import { useState, useRef, useEffect, useCallback } from 'react';
import { SendHorizontal, Send, Paperclip, Image, Loader2, Binary } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FileUploadButton } from './FileUploadButton';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

interface FileUpload {
  file: File;
  progress: number;
}

// 设置最大字符数
const MAX_CHARS = 4000;

// 预设的数学公式模板
const mathTemplates = [
  { name: '行内公式', template: '$f(x) = y$' },
  { name: '块级公式', template: '$$\nf(x) = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$' },
  { name: '分数', template: '$\\frac{分子}{分母}$' },
  { name: '矩阵', template: '$$\n\\begin{pmatrix}\na & b \\\\\nc & d\n\\end{pmatrix}\n$$' },
  { name: '求和', template: '$\\sum_{i=1}^{n} i^2$' },
  { name: '平方根', template: '$\\sqrt{x}$' },
];

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

  const insertMathTemplate = (template: string) => {
    if (!textareaRef.current) return;
    
    const cursorPos = textareaRef.current.selectionStart;
    const textBefore = input.substring(0, cursorPos);
    const textAfter = input.substring(cursorPos);
    
    const newValue = textBefore + template + textAfter;
    setInput(newValue);
    
    // 聚焦回输入框
    setTimeout(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      
      // 设置光标位置到公式中间
      const newCursorPos = cursorPos + template.length;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full mx-auto max-w-full">
      <div className="rounded-xl bg-background border border-input/70 shadow-sm hover:border-primary/30 transition-colors duration-200">
        <div className="flex items-center px-2 py-1">
          <div className="flex items-center gap-1">
            <FileUploadButton
              icon={<Image className="h-4 w-4" />}
              tooltip="上传图片"
              onFileSelect={handleFileSelect}
              isImage={true}
              disabled={isLoading}
            />
            <FileUploadButton
              icon={<Paperclip className="h-4 w-4" />}
              tooltip="上传文件"
              onFileSelect={handleFileSelect}
              disabled={isLoading}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg opacity-70 hover:opacity-100 transition-all duration-200"
                  disabled={isLoading}
                >
                  <Binary className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-[320px] p-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">插入数学公式</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mathTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto py-1 justify-start text-xs font-normal"
                        onClick={() => insertMathTemplate(template.template)}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    使用 $ 符号包裹行内公式，$$ 符号包裹块级公式
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            id="message-input"
            placeholder={t('chat.inputPlaceholder') || "输入您的消息..."}
            className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent p-2 pb-4 focus-visible:ring-0 focus-visible:ring-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            maxLength={MAX_CHARS}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            {input.length > 0 && !isLoading && (
              <span className="text-xs text-muted-foreground select-none">
                {input.length}/{MAX_CHARS}
              </span>
            )}
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || input.trim().length === 0 || isUploading}
              className={cn(
                "h-8 w-8 rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                "transition-all duration-200 ease-in-out",
                (isLoading || input.trim().length === 0 || isUploading) && "opacity-50"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
      
      {uploads.length > 0 && (
        <div className="mt-2 space-y-2 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/30">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">上传中的文件</h4>
          {uploads.map((upload) => (
            <div key={upload.file.name} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground truncate flex-1">
                {upload.file.name}
              </span>
              <Progress value={upload.progress} className="w-24 h-2" />
            </div>
          ))}
        </div>
      )}
    </form>
  );
}