import React, { useState } from 'react';
import { MathRendererForMessages } from './MathRenderer';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MessageActions } from './MessageActions';
import { Pencil, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { MessageContent } from './MessageContent';

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
  className?: string;
  timestamp?: Date;
  isTyping?: boolean;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onEdit?: (content: string) => void;
  totalBranches?: number;
  currentBranch?: number;
  onSwitchBranch?: (branchNumber: number) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isUser = false,
  className,
  timestamp,
  isTyping,
  isStreaming,
  onRegenerate,
  onEdit,
  totalBranches,
  currentBranch,
  onSwitchBranch
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  
  // Detect if content is purely mathematical formula
  const isPureMath = content.trim().startsWith('$') && content.trim().endsWith('$');
  
  // Format timestamp if provided
  const formattedTime = timestamp ? new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(timestamp) : '';
  
  // Animation variants for bubble
  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      y: 10,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      }
    }
  };
  
  // Handle start editing
  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Starting edit mode with content:", content);
    setEditedContent(content);
    setIsEditing(true);
  };
  
  // Handle cancel edit
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };
  
  // Handle save edit
  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && editedContent.trim() !== '') {
      console.log("Saving edited content:", editedContent);
      onEdit(editedContent);
      setIsEditing(false);
    }
  };
  
  // Use motion.div for animated content
  const BubbleContainer = isStreaming || isTyping ? motion.div : 'div';
  
  return (
    <div
      className={cn(
        'message-bubble-container relative group',
        isUser ? 'flex justify-end' : 'flex justify-start'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BubbleContainer
        className={cn(
          'message-bubble max-w-[95%] relative',
          isUser 
            ? 'user-bubble rounded-2xl rounded-tr-sm ml-auto bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm'
            : 'ai-bubble rounded-2xl rounded-tl-sm bg-card border border-border/30 shadow-sm',
          isPureMath && 'math-message-bubble',
          isTyping && 'is-typing',
          'transition-all duration-300 ease-in-out transform-gpu',
          className
        )}
        initial={isStreaming || isTyping ? "initial" : undefined}
        animate={isStreaming || isTyping ? "animate" : undefined}
        variants={isStreaming || isTyping ? bubbleVariants : undefined}
      >
        {isEditing ? (
          <div className="p-2 w-full">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={cn(
                "min-h-[80px] w-full bg-transparent border border-blue-300/50 dark:border-blue-700/50",
                "focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-600",
                "placeholder:text-blue-300/60 dark:placeholder:text-blue-500/60",
                "resize-none"
              )}
              autoFocus
            />
            <div className="flex justify-end mt-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs py-1 px-2 h-auto bg-transparent"
                onClick={handleCancelEdit}
              >
                <X className="mr-1 h-3 w-3" />
                取消
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-xs py-1 px-2 h-auto bg-blue-600 hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                <Check className="mr-1 h-3 w-3" />
                保存
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn(
            "w-full overflow-hidden markdown-content-wrapper",
            "transition-all duration-300 ease-in-out layout-stable",
            "transform-gpu",
            isUser ? "px-3 py-2.5" : "px-4 py-3",
            isPureMath && "math-container"
          )}>
            <MathRendererForMessages
              content={content}
              displayMode={false}
              className={cn(
                'message-math w-full layout-stable',
                'transition-height duration-300',
                isUser ? 'user-message-math' : '',
                isPureMath && 'pure-math-content'
              )}
            />
          </div>
        )}
        
        {/* Timestamp display */}
        {timestamp && !isTyping && !isEditing && (
          <div className={cn(
            "absolute -bottom-5 text-[0.65rem] text-muted-foreground/70 px-1",
            isUser ? "left-1" : "left-1",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          )}>
            {formattedTime}
          </div>
        )}
        
        {/* Message actions */}
        {!isTyping && !isUser && onRegenerate && !isEditing && (
          <div className={cn(
            "absolute -bottom-5 right-1 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <MessageActions content={content} onRegenerate={onRegenerate} />
          </div>
        )}
        
        {/* Edit option for user messages */}
        {!isTyping && isUser && onEdit && !isEditing && (
          <div className={cn(
            "absolute -bottom-5 right-1 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn(
                        'h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/40',
                        'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
                        'shadow-sm border border-blue-200 dark:border-blue-800/40',
                        'hover:bg-blue-200 dark:hover:bg-blue-800/50'
                      )}
                      onClick={handleStartEdit}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>编辑消息</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* Elegant branch indicator for AI responses with multiple branches */}
        {!isUser && totalBranches && totalBranches > 1 && (
          <div className="absolute top-1 right-1 flex items-center gap-0.5">
            {Array.from({ length: totalBranches }).map((_, i) => (
              <button
                key={i}
                className={cn(
                  "w-4 h-1 rounded-sm transition-all duration-300",
                  currentBranch === i + 1 
                    ? "bg-primary/70" 
                    : "bg-muted-foreground/10 hover:bg-muted-foreground/20",
                  "opacity-70 hover:opacity-100"
                )}
                onClick={() => onSwitchBranch && onSwitchBranch(i + 1)}
                title={`Response variation ${i + 1}`}
              />
            ))}
          </div>
        )}
      </BubbleContainer>
      
      {/* Typing indicator for AI messages */}
      {!isUser && isTyping && (
        <div className="typing-indicator">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}
    </div>
  );
};