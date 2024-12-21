import { ParameterCategory } from '@/types/parameters';

export const PARAMETER_CATEGORIES: Record<ParameterCategory, { label: string; description: string }> = {
  nutrients: {
    label: 'Nutrients',
    description: 'Essential elements for aquatic life and plant growth',
  },
  organic: {
    label: 'Organic Matter',
    description: 'Carbon-based compounds and organic pollutants',
  },
  physical: {
    label: 'Physical Properties',
    description: 'Basic physical characteristics of water',
  },
  metals: {
    label: 'Metals',
    description: 'Dissolved metal concentrations',
  },
  minerals: {
    label: 'Minerals',
    description: 'Dissolved mineral content',
  },
  ions: {
    label: 'Ions',
    description: 'Ionic compounds and electrolytes',
  },
  toxins: {
    label: 'Toxins',
    description: 'Harmful substances and pollutants',
  },
  biological: {
    label: 'Biological',
    description: 'Biological indicators and organic content',
  },
};