import { Card } from '@/components/ui/card';
import { RolePermissionsTable } from './RolePermissionsTable';
import { Shield } from 'lucide-react';

export function PermissionSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Role Permissions</h2>
      </div>
      
      <Card className="p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            This table shows the permissions assigned to each role in the system.
            Only administrators can modify role permissions.
          </p>
        </div>
        <RolePermissionsTable />
      </Card>
    </div>
  );
}