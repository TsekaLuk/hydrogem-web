import { BaseParameterCard } from './BaseParameterCard';
import { WaterQualityParameter, ParameterTranslation } from '@/types/parameters';

interface MetalParameterCardProps {
  parameter: WaterQualityParameter;
  translation: ParameterTranslation;
  className?: string;
}

export function MetalParameterCard({ parameter, translation, className }: MetalParameterCardProps) {
  return (
    <BaseParameterCard
      parameter={parameter}
      translation={translation}
      className={className}
      gradient="from-zinc-500/20 via-slate-500/20 to-stone-500/20"
    />
  );
}