import { UserAvatar } from './UserAvatar';
import { UserBadge } from './UserBadge';
import { useUserProfileContext } from '@/contexts/UserProfileContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function UserProfileHeader() {
  const { profile, isLoading } = useUserProfileContext();

  if (isLoading) {
    return <UserProfileHeaderSkeleton />;
  }

  if (!profile) return null;

  return (
    <div className="flex items-center gap-4">
      <UserAvatar user={profile} size="lg" showStatus />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold truncate">{profile.name}</h1>
          <UserBadge role={profile.role} />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span className="truncate">{profile.email}</span>
          {profile.department && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{profile.department}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function UserProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  );
}