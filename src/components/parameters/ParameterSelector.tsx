import { WaterQualityParameter, ParameterCategory } from '@/types/parameters';
import { useTranslation } from 'react-i18next';
import { ParameterCategoryCard } from './ParameterCategoryCard';
import { useMonitoringData } from '@/hooks/useMonitoringData';

interface ParameterSelectorProps {
  onSelectParameter?: (parameter: WaterQualityParameter) => void;
}

const PARAMETER_CATEGORIES: Record<ParameterCategory, { key: string }> = {
  physical: { key: 'physical' },
  organic: { key: 'organic' },
  metals: { key: 'metals' },
  toxins: { key: 'toxins' },
  ions: { key: 'ions' },
  biological: { key: 'biological' }
};

export function ParameterSelector({ onSelectParameter }: ParameterSelectorProps) {
  const { t } = useTranslation(['monitoring']);
  const { parameters } = useMonitoringData();

  const groupedParameters = parameters.reduce((acc, param) => {
    if (!acc[param.category]) {
      acc[param.category] = [];
    }
    acc[param.category].push(param);
    return acc;
  }, {} as Record<string, WaterQualityParameter[]>);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(PARAMETER_CATEGORIES).map(([category, { key }]) => (
        <ParameterCategoryCard
          key={category}
          categoryKey={key}
          parameters={groupedParameters[category] || []}
          onSelectParameter={onSelectParameter}
        />
      ))}
    </div>
  );
}