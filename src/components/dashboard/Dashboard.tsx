import { useTranslation } from 'react-i18next';
import { DashboardMetrics } from './DashboardMetrics';
import { SystemChart } from './SystemChart';
import { useEffect } from 'react';

export function Dashboard() {
  const { t, i18n } = useTranslation(['common', 'dashboard']);

  useEffect(() => {
    console.log('Dashboard mounted');
    console.log('Current language:', i18n.language);
    console.log('Available translations:', i18n.store.data);
  }, [i18n]);

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <div className="flex justify-center w-full">
        <div className="relative w-full min-w-[320px] max-w-screen-2xl flex-1 px-[calc(0.5rem+1vw)] sm:px-[calc(1rem+1vw)] lg:px-[calc(1.5rem+1vw)]">
          <div className="w-full py-[calc(0.5rem+1vh)] sm:py-[calc(1rem+1vh)]">
            <div className="grid grid-cols-1 gap-[calc(0.5rem+0.5vw)] sm:gap-[calc(0.75rem+0.5vw)] md:gap-[calc(1rem+0.5vw)] auto-rows-min">
              <DashboardMetrics />
              <SystemChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}