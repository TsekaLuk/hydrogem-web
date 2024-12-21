import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROLE_PERMISSIONS, PERMISSION_CONFIG } from '@/lib/permissions';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RolePermissionsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Permission</TableHead>
            {ROLE_PERMISSIONS.map((role) => (
              <TableHead key={role.role} className="text-center">
                {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSION_CONFIG.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{permission.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {permission.description}
                  </div>
                </div>
              </TableCell>
              {ROLE_PERMISSIONS.map((role) => (
                <TableCell key={role.role} className="text-center">
                  {role.permissions.includes(permission.id) ? (
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}