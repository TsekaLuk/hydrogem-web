import { useState, useCallback } from 'react';
import { Permission, PermissionCheck } from '@/types/permissions';
import { ROLE_PERMISSIONS } from '@/lib/permissions';
import { useUserProfile } from './useUserProfile';

export function usePermissions() {
  const { profile } = useUserProfile('current-user');
  const [permissionCache] = useState(new Map<string, boolean>());

  const checkPermission = useCallback((permission: Permission): PermissionCheck => {
    if (!profile) {
      return {
        hasPermission: false,
        reason: 'User not authenticated'
      };
    }

    const cacheKey = `${profile.role}:${permission}`;
    if (permissionCache.has(cacheKey)) {
      return {
        hasPermission: permissionCache.get(cacheKey)!
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
    permissionCache.set(cacheKey, hasPermission);

    return {
      hasPermission,
      reason: hasPermission ? undefined : 'Insufficient permissions'
    };
  }, [profile, permissionCache]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return checkPermission(permission).hasPermission;
  }, [checkPermission]);

  const clearPermissionCache = useCallback(() => {
    permissionCache.clear();
  }, [permissionCache]);

  return {
    checkPermission,
    hasPermission,
    clearPermissionCache
  };
}