import { createContext, useContext, useCallback } from 'react';
import { Permission, PermissionCheck } from '@/types/permissions';
import { useUserProfileContext } from './UserProfileContext';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

interface PermissionContextType {
  checkPermission: (permission: Permission) => PermissionCheck;
  hasPermission: (permission: Permission) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useUserProfileContext();

  const checkPermission = useCallback((permission: Permission): PermissionCheck => {
    if (!profile) {
      return {
        hasPermission: false,
        reason: 'User not authenticated'
      };
    }

    const roleConfig = ROLE_PERMISSIONS.find(r => r.role === profile.role);
    if (!roleConfig) {
      return {
        hasPermission: false,
        reason: 'Invalid role configuration'
      };
    }

    const hasPermission = roleConfig.permissions.includes(permission);
    return {
      hasPermission,
      reason: hasPermission ? undefined : 'Insufficient permissions'
    };
  }, [profile]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return checkPermission(permission).hasPermission;
  }, [checkPermission]);

  return (
    <PermissionContext.Provider value={{ checkPermission, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}