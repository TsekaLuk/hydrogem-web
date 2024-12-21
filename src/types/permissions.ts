export type Permission = 
  | 'view_dashboard'
  | 'edit_parameters'
  | 'manage_users'
  | 'view_analytics'
  | 'manage_alerts'
  | 'system_config'
  | 'view_reports'
  | 'export_data';

export type PermissionGroup = 
  | 'dashboard'
  | 'parameters'
  | 'users'
  | 'analytics'
  | 'alerts'
  | 'system'
  | 'reports';

export interface RolePermissions {
  role: string;
  permissions: Permission[];
  description: string;
}

export interface PermissionConfig {
  id: Permission;
  group: PermissionGroup;
  label: string;
  description: string;
}

export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
}