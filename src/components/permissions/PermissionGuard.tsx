import { Permission } from '@/types/permissions';
import { usePermissions } from '@/contexts/PermissionContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { checkPermission } = usePermissions();
  const { hasPermission, reason } = checkPermission(permission);

  if (!hasPermission) {
    return fallback || (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          {reason || 'You do not have permission to access this feature.'}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}