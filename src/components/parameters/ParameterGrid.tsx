import { ParameterGroup } from '@/types/parameters';
import { NutrientParameter } from './NutrientParameter';
import { MetalParameter } from './MetalParameter';
import { PhysicalParameter } from './PhysicalParameter';
import { OrganicParameter } from './OrganicParameter';
import { ToxinParameter } from './ToxinParameter';
import { IonParameter } from './IonParameter';
import { cn } from '@/lib/utils';

interface ParameterGridProps {
  groups: ParameterGroup[];
  className?: string;
}

export function ParameterGrid({ groups, className }: ParameterGridProps) {
  const renderParameter = (group: ParameterGroup, parameter: Parameter) => {
    switch (group.category) {
      case 'nutrients':
        return <NutrientParameter parameter={parameter} />;
      case 'metals':
        return <MetalParameter parameter={parameter} />;
      case 'physical':
        return <PhysicalParameter parameter={parameter} />;
      case 'organic':
        return <OrganicParameter parameter={parameter} />;
      case 'toxins':
        return <ToxinParameter parameter={parameter} />;
      case 'ions':
        return <IonParameter parameter={parameter} />;
      default:
        return <NutrientParameter parameter={parameter} />;
    }
  };

  return (
    <div className={cn('space-y-8', className)}>
      {groups.map((group) => (
        <div key={group.category}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{group.title}</h2>
            <p className="text-sm text-muted-foreground">
              {group.description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.parameters.map((parameter) => (
              <div key={parameter.id} className="w-full flex">
                {renderParameter(group, parameter)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}