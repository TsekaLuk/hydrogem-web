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
        return <PhysicalParameterCard parameter={param} translation={paramTranslation} className="flex-1" />;
      case 'organic':
        return <OrganicParameterCard parameter={param} translation={paramTranslation} className="flex-1" />;
      case 'metals':
        return <MetalParameterCard parameter={param} translation={paramTranslation} className="flex-1" />;
      case 'toxins':
        return <ToxinParameterCard parameter={param} translation={paramTranslation} className="flex-1" />;
      case 'ions':
        return <IonParameterCard parameter={param} translation={paramTranslation} className="flex-1" />;
      case 'biological':
        return <BiologicalParameterCard parameter={param} translation={paramTranslation} className="flex-1" />;
      default:
        return <PhysicalParameterCard parameter={param} translation={paramTranslation} className="flex-1" />;
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {parameters.map((param) => (
        <div key={param.id}>
          {getParameterCard(param)}
        </div>
      ))}
    </div>
  );
}