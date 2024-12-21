export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';
export type UserStatus = 'online' | 'away' | 'offline';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  title?: string;
  lastActive: Date;
  createdAt: Date;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'settings_change' | 'parameter_update';
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}