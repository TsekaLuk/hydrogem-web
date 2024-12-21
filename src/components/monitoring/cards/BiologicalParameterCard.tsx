import { BaseParameterCard } from './BaseParameterCard';
import { WaterQualityParameter, ParameterTranslation } from '@/types/parameters';

interface BiologicalParameterCardProps {
  parameter: WaterQualityParameter;
  translation: ParameterTranslation;
  className?: string;
}

export function BiologicalParameterCard({ parameter, translation, className }: BiologicalParameterCardProps) {
  return (
    <BaseParameterCard
      parameter={parameter}
      translation={translation}
      className={className}
      gradient="from-teal-500/20 via-cyan-500/20 to-sky-500/20"
    />
  );
}