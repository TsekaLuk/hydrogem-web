import { HelpCategory } from '@/types/help';
import {
  LayoutDashboard,
  Settings,
  Bell,
  Shield,
  LineChart,
  Users,
  HelpCircle,
} from 'lucide-react';

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using the platform',
    icon: HelpCircle,
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Understanding the dashboard and its features',
    icon: LayoutDashboard,
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Water quality monitoring features',
    icon: LineChart,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Managing alerts and notifications',
    icon: Bell,
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Managing users and roles',
    icon: Users,
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security features and best practices',
    icon: Shield,
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configuring your account and preferences',
    icon: Settings,
  },
];