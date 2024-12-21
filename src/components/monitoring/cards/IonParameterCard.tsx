import { BaseParameterCard } from './BaseParameterCard';
import { WaterQualityParameter, ParameterTranslation } from '@/types/parameters';

interface IonParameterCardProps {
  parameter: WaterQualityParameter;
  translation: ParameterTranslation;
  className?: string;
}

export function IonParameterCard({ parameter, translation, className }: IonParameterCardProps) {
  return (
    <BaseParameterCard
      parameter={parameter}
      translation={translation}
      className={className}
      gradient="from-violet-500/20 via-purple-500/20 to-fuchsia-500/20"
    />
  );
}