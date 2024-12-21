import { 
  Droplets, Thermometer, Wind, Beaker, 
  Atom, Gauge, Zap, Skull, Leaf 
} from 'lucide-react';
import { Parameter } from '@/types/monitoring';

export const MONITORING_PARAMETERS: Parameter[] = [
  {
    id: 'ph',
    name: 'pH Level',
    value: 7.2,
    unit: 'pH',
    icon: Gauge,
    minValue: 0,
    maxValue: 14,
    warningThreshold: 6.5,
    criticalThreshold: 5.5,
    category: 'physical'
  },
  {
    id: 'temperature',
    name: 'Temperature',
    value: 25.3,
    unit: '°C',
    icon: Thermometer,
    minValue: 0,
    maxValue: 40,
    warningThreshold: 28,
    criticalThreshold: 32,
    category: 'physical'
  },
  {
    id: 'oxygen',
    name: 'Dissolved Oxygen',
    value: 8.1,
    unit: 'mg/L',
    icon: Wind,
    minValue: 0,
    maxValue: 15,
    warningThreshold: 6,
    criticalThreshold: 4,
    category: 'physical'
  },
  {
    id: 'cod',
    name: 'Chemical Oxygen Demand',
    value: 21.31,
    unit: 'mg/L',
    icon: Beaker,
    minValue: 0,
    maxValue: 40,
    warningThreshold: 30,
    criticalThreshold: 35,
    category: 'organic'
  },
  {
    id: 'turbidity',
    name: 'Turbidity',
    value: 0.52,
    unit: 'NTU',
    icon: Droplets,
    minValue: 0,
    maxValue: 1,
    warningThreshold: 0.8,
    criticalThreshold: 0.9,
    category: 'physical'
  },
  {
    id: 'zinc',
    name: 'Zinc',
    value: 0.5,
    unit: 'mg/L',
    icon: Atom,
    minValue: 0,
    maxValue: 1.0,
    warningThreshold: 0.8,
    criticalThreshold: 0.9,
    category: 'metals'
  },
  {
    id: 'copper',
    name: 'Copper',
    value: 0.52,
    unit: 'mg/L',
    icon: Atom,
    minValue: 0,
    maxValue: 1.0,
    warningThreshold: 0.8,
    criticalThreshold: 0.9,
    category: 'metals'
  },
  {
    id: 'hardness',
    name: 'Total Hardness',
    value: 283.06,
    unit: 'mg/L',
    icon: Zap,
    minValue: 150,
    maxValue: 450,
    warningThreshold: 400,
    criticalThreshold: 425,
    category: 'minerals'
  },
  {
    id: 'chloride',
    name: 'Chloride',
    value: 133.15,
    unit: 'mg/L',
    icon: Zap,
    minValue: 0,
    maxValue: 250,
    warningThreshold: 200,
    criticalThreshold: 225,
    category: 'ions'
  },
  {
    id: 'phenols',
    name: 'Phenols',
    value: 0,
    unit: 'mg/L',
    icon: Skull,
    minValue: 0,
    maxValue: 0.002,
    warningThreshold: 0.0015,
    criticalThreshold: 0.0018,
    category: 'toxins'
  },
  {
    id: 'chlorophyll',
    name: 'Chlorophyll',
    value: 14.25,
    unit: 'μg/L',
    icon: Leaf,
    minValue: 0,
    maxValue: 30,
    warningThreshold: 25,
    criticalThreshold: 28,
    category: 'biological'
  }
];