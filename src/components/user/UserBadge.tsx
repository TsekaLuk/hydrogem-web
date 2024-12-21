import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/user';
import { Shield, Eye, Users, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserBadgeProps {
  role: UserRole;
  className?: string;
}

export function UserBadge({ role, className }: UserBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          icon: Shield,
          color: 'text-red-500 dark:text-red-400',
          bgColor: 'bg-red-500/10',
        };
      case 'manager':
        return {
          icon: Database,
          color: 'text-blue-500 dark:text-blue-400',
          bgColor: 'bg-blue-500/10',
        };
      case 'operator':
        return {
          icon: Users,
          color: 'text-emerald-500 dark:text-emerald-400',
          bgColor: 'bg-emerald-500/10',
        };
      default:
        return {
          icon: Eye,
          color: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-500/10',
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1 px-2 py-0.5',
        config.bgColor,
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="capitalize">{role}</span>
    </Badge>
  );
}