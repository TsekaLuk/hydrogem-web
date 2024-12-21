import { Toast } from '@/components/ui/toast';
import { Notification } from '@/types/notifications';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <Toast
        className={cn(
          'flex items-start gap-4 p-4',
          notification.type === 'error' && 'border-red-500/50 bg-red-500/10',
          notification.type === 'warning' && 'border-amber-500/50 bg-amber-500/10',
          notification.type === 'success' && 'border-emerald-500/50 bg-emerald-500/10'
        )}
      >
        {getIcon()}
        <div className="flex-1 space-y-1">
          <p className="font-medium">{notification.title}</p>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </Toast>
    </motion.div>
  );
}