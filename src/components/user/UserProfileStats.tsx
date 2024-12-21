import { Card } from '@/components/ui/card';
import { Activity, Clock, Calendar } from 'lucide-react';
import { UserProfile } from '@/types/user';
import { cn } from '@/lib/utils';

interface UserProfileStatsProps {
  user: UserProfile;
  className?: string;
}

export function UserProfileStats({ user, className }: UserProfileStatsProps) {
  const stats = [
    {
      icon: Activity,
      label: 'Status',
      value: user.status.charAt(0).toUpperCase() + user.status.slice(1),
    },
    {
      icon: Clock,
      label: 'Last Active',
      value: user.lastActive.toLocaleTimeString(),
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: user.createdAt.toLocaleDateString(),
    },
  ];

  return (
    <div className={cn('grid gap-4 sm:grid-cols-3', className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Icon className="h-4 w-4" />
              <span className="text-sm">{stat.label}</span>
            </div>
            <p className="text-lg font-medium">{stat.value}</p>
          </Card>
        );
      })}
    </div>
  );
}