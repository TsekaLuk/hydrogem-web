import { BaseParameterCard } from './BaseParameterCard';
import { WaterQualityParameter, ParameterTranslation } from '@/types/parameters';

interface ToxinParameterCardProps {
  parameter: WaterQualityParameter;
  translation: ParameterTranslation;
  className?: string;
}

export function ToxinParameterCard({ parameter, translation, className }: ToxinParameterCardProps) {
  return (
    <BaseParameterCard
      parameter={parameter}
      translation={translation}
      className={className}
      gradient="from-rose-500/20 via-red-500/20 to-pink-500/20"
    />
  );
}