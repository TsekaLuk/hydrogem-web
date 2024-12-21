import { LucideIcon } from 'lucide-react';

export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface HelpArticle {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: Date;
  tags: string[];
}