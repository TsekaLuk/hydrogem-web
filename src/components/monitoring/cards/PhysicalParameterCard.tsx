import { BaseParameterCard } from './BaseParameterCard';
import { WaterQualityParameter, ParameterTranslation } from '@/types/parameters';

interface PhysicalParameterCardProps {
  parameter: WaterQualityParameter;
  translation: ParameterTranslation;
  className?: string;
}

export function PhysicalParameterCard({ parameter, translation, className }: PhysicalParameterCardProps) {
  return (
    <BaseParameterCard
      parameter={parameter}
      translation={translation}
      className={className}
      gradient="from-cyan-500/20 via-blue-500/20 to-indigo-500/20"
    />
  );
}