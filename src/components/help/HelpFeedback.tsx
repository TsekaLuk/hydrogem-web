import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpFeedbackProps {
  articleId: string;
}

export function HelpFeedback({ articleId }: HelpFeedbackProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real app, send feedback to backend
    console.log({ articleId, feedback, comment });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mt-4 text-sm text-muted-foreground">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Was this article helpful?</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              feedback === 'helpful' && 'bg-emerald-500/10 text-emerald-500'
            )}
            onClick={() => setFeedback('helpful')}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Yes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              feedback === 'not-helpful' && 'bg-red-500/10 text-red-500'
            )}
            onClick={() => setFeedback('not-helpful')}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            No
          </Button>
        </div>

        {feedback === 'not-helpful' && (
          <div className="space-y-2">
            <Textarea
              placeholder="How can we improve this article?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <Button size="sm" onClick={handleSubmit}>
              Submit Feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}