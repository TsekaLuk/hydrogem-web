import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { validateFile } from '@/lib/file-utils';
import { cn } from '@/lib/utils';

interface FileUploadButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onFileSelect: (file: File) => void;
  isImage?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileUploadButton({
  icon,
  tooltip,
  onFileSelect,
  isImage = false,
  disabled,
  className
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file, isImage);
    if (error) {
      alert(error);
      return;
    }

    onFileSelect(file);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={isImage ? "image/*" : undefined}
        onChange={handleFileChange}
      />
      <Tooltip content={tooltip}>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            "h-8 w-8 rounded-lg",
            "opacity-70 hover:opacity-100",
            "transition-all duration-200",
            className
          )}
        >
          {icon}
        </Button>
      </Tooltip>
    </>
  );
}