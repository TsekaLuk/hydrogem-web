import { HelpArticle } from '@/types/help';

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'getting-started-overview',
    categoryId: 'getting-started',
    title: 'Platform Overview',
    description: 'Learn about the key features and capabilities',
    content: `
# Welcome to HydroGem

HydroGem is a comprehensive water quality monitoring platform that helps you:

- Monitor water quality parameters in real-time
- Receive alerts for critical changes
- Generate detailed analytics reports
- Manage user access and permissions

## Key Features

1. Real-time Monitoring
2. Smart Alerts
3. Advanced Analytics
4. User Management
5. Custom Reports

## Getting Started

1. Log in to your account
2. Configure your monitoring parameters
3. Set up notifications
4. Start monitoring!
    `,
    lastUpdated: new Date('2024-01-15'),
    tags: ['overview', 'getting-started', 'basics'],
  },
  {
    id: 'dashboard-overview',
    categoryId: 'dashboard',
    title: 'Understanding the Dashboard',
    description: 'Learn how to use the main dashboard effectively',
    content: `
# Dashboard Guide

The dashboard provides a comprehensive overview of your water quality monitoring system.

## Key Metrics

- pH Levels
- Temperature
- Dissolved Oxygen
- Conductivity

## Customization

You can customize your dashboard by:

1. Rearranging widgets
2. Setting display preferences
3. Configuring update intervals

## Tips

- Use the search function to quickly find specific parameters
- Hover over charts for detailed information
- Set up custom views for different monitoring needs
    `,
    lastUpdated: new Date('2024-01-20'),
    tags: ['dashboard', 'metrics', 'customization'],
  },
  // Add more articles as needed
];