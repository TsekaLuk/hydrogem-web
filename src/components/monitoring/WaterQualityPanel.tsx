import { useMonitoringData } from '@/hooks/useMonitoringData';
import { PhysicalParameterCard } from './cards/PhysicalParameterCard';
import { OrganicParameterCard } from './cards/OrganicParameterCard';
import { MetalParameterCard } from './cards/MetalParameterCard';
import { ToxinParameterCard } from './cards/ToxinParameterCard';
import { IonParameterCard } from './cards/IonParameterCard';
import { BiologicalParameterCard } from './cards/BiologicalParameterCard';
import { useTranslation } from 'react-i18next';
import { WaterQualityParameter } from '@/types/parameters';

export function WaterQualityPanel() {
  const { t } = useTranslation(['monitoring']);
  const { parameters } = useMonitoringData();

  const getParameterCard = (param: WaterQualityParameter) => {
    const paramTranslation = {
      name: t(`parameters.${param.key}.name`),
      description: t(`parameters.${param.key}.description`),
      unit: t(`parameters.${param.key}.unit`),
      range: t(`parameters.${param.key}.range`),
    };

    switch (param.category) {
      case 'physical':
        return <PhysicalParameterCard parameter={param} translation={paramTranslation} className="h-full" />;
      case 'organic':
        return <OrganicParameterCard parameter={param} translation={paramTranslation} className="h-full" />;
      case 'metals':
        return <MetalParameterCard parameter={param} translation={paramTranslation} className="h-full" />;
      case 'toxins':
        return <ToxinParameterCard parameter={param} translation={paramTranslation} className="h-full" />;
      case 'ions':
        return <IonParameterCard parameter={param} translation={paramTranslation} className="h-full" />;
      case 'biological':
        return <BiologicalParameterCard parameter={param} translation={paramTranslation} className="h-full" />;
      default:
        return <PhysicalParameterCard parameter={param} translation={paramTranslation} className="h-full" />;
    }
  };

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {parameters.map((param) => (
        <div key={param.id} className="h-full">
          {getParameterCard(param)}
        </div>
      ))}
    </div>
  );
}