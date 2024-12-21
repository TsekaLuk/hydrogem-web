import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationList } from './NotificationList';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const { notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(markAllAsRead, 1000);
    return () => clearTimeout(timer);
  }, [open, markAllAsRead]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-accent/50"
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={cn(
                  'absolute -top-1 -right-1 h-4 w-4',
                  'bg-primary text-primary-foreground',
                  'rounded-full text-xs flex items-center justify-center',
                  'font-medium'
                )}
              >
                {unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <NotificationList notifications={notifications} />
      </SheetContent>
    </Sheet>
  );
}