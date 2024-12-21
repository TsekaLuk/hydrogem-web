import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ParameterSelector } from '@/components/parameters/ParameterSelector';
import { WaterQualityParameter } from '@/types/parameters';
import { useTranslation } from 'react-i18next';

interface ParameterConfigProps {
  onParameterSelect?: (parameter: WaterQualityParameter) => void;
}

export function ParameterConfig({ onParameterSelect }: ParameterConfigProps) {
  const { t } = useTranslation(['monitoring']);
  const [open, setOpen] = useState(false);

  const handleParameterSelect = (parameter: WaterQualityParameter) => {
    onParameterSelect?.(parameter);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          {t('actions.configure')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('actions.configure')}</DialogTitle>
          <DialogDescription>
            {t('actions.configureDescription')}
          </DialogDescription>
        </DialogHeader>
        <ParameterSelector onSelectParameter={handleParameterSelect} />
      </DialogContent>
    </Dialog>
  );
}