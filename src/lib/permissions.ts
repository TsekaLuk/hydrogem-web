import { Permission, RolePermissions, PermissionConfig } from '@/types/permissions';

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      'view_dashboard',
      'edit_parameters',
      'manage_users',
      'view_analytics',
      'manage_alerts',
      'system_config',
      'view_reports',
      'export_data'
    ],
    description: 'Full system access with all permissions'
  },
  {
    role: 'manager',
    permissions: [
      'view_dashboard',
      'edit_parameters',
      'view_analytics',
      'manage_alerts',
      'view_reports',
      'export_data'
    ],
    description: 'Can manage system parameters and view analytics'
  },
  {
    role: 'operator',
    permissions: [
      'view_dashboard',
      'edit_parameters',
      'view_analytics',
      'view_reports'
    ],
    description: 'Can view and edit basic system parameters'
  },
  {
    role: 'viewer',
    permissions: [
      'view_dashboard',
      'view_analytics',
      'view_reports'
    ],
    description: 'Read-only access to dashboard and reports'
  }
];

export const PERMISSION_CONFIG: PermissionConfig[] = [
  {
    id: 'view_dashboard',
    group: 'dashboard',
    label: 'View Dashboard',
    description: 'Access to view the main dashboard'
  },
  {
    id: 'edit_parameters',
    group: 'parameters',
    label: 'Edit Parameters',
    description: 'Ability to modify system parameters'
  },
  {
    id: 'manage_users',
    group: 'users',
    label: 'Manage Users',
    description: 'Full access to user management'
  },
  {
    id: 'view_analytics',
    group: 'analytics',
    label: 'View Analytics',
    description: 'Access to analytics and reports'
  },
  {
    id: 'manage_alerts',
    group: 'alerts',
    label: 'Manage Alerts',
    description: 'Configure and manage system alerts'
  },
  {
    id: 'system_config',
    group: 'system',
    label: 'System Configuration',
    description: 'Access to system-wide settings'
  },
  {
    id: 'view_reports',
    group: 'reports',
    label: 'View Reports',
    description: 'Access to view system reports'
  },
  {
    id: 'export_data',
    group: 'reports',
    label: 'Export Data',
    description: 'Ability to export system data'
  }
];