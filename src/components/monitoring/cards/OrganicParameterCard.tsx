import { WaterQualityParameter, ParameterTranslation } from '@/types/parameters';
import { BaseParameterCard } from './BaseParameterCard';

interface OrganicParameterCardProps {
  parameter: WaterQualityParameter;
  translation: ParameterTranslation;
  className?: string;
}

export function OrganicParameterCard({ parameter, translation, className }: OrganicParameterCardProps) {
  return (
    <BaseParameterCard
      parameter={parameter}
      translation={translation}
      className={className}
      gradient="from-emerald-500/20 via-green-500/20 to-lime-500/20"
      iconClassName="text-emerald-600 dark:text-emerald-400"
    />
  );
}