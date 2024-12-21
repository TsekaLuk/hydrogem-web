import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WaterQualityParameter } from '@/types/parameters';
import { useTranslation } from 'react-i18next';

interface ParameterCategoryCardProps {
  categoryKey: string;
  parameters: WaterQualityParameter[];
  onSelectParameter?: (parameter: WaterQualityParameter) => void;
}

export function ParameterCategoryCard({
  categoryKey,
  parameters,
  onSelectParameter,
}: ParameterCategoryCardProps) {
  const { t } = useTranslation(['monitoring']);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-2">
        {t(`categories.${categoryKey}.name`)}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t(`categories.${categoryKey}.description`)}
      </p>
      <div className="flex flex-wrap gap-2">
        {parameters.map((param) => (
          <Badge
            key={param.id}
            variant="secondary"
            className={cn(
              'cursor-pointer hover:bg-accent transition-colors',
              'flex items-center gap-1'
            )}
            onClick={() => onSelectParameter?.(param)}
          >
            {t(`parameters.${param.key}.name`)}
          </Badge>
        ))}
      </div>
    </Card>
  );
}