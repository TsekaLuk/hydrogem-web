import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'compact';
  showBeta?: boolean;
}

export function Logo({ className, variant = 'default', showBeta = false }: LogoProps) {
  const { t } = useTranslation();

  return (
    <div 
      className={cn(
        'flex items-center gap-3 select-none',
        variant === 'compact' ? 'scale-90' : '',
        className
      )} 
    >
      <div
        className={cn(
          'relative flex items-center justify-center',
          'h-9 w-9 rounded-xl overflow-visible',
          'transition-all duration-300 group'
        )}
      >
        <img 
          src="/brand-icons/HydroGem-logo-removebg.png" 
          alt="HydroGem Logo" 
          className={cn(
            'h-8 w-8',
            'transition-all duration-300',
            'group-hover:scale-110'
          )} 
        />
      </div>
      
      {variant === 'default' && (
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-bold text-lg tracking-tight',
            'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500',
            'dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400',
            'bg-clip-text text-transparent'
          )}>
            {t('app.name')}
          </span>
          {showBeta && (
            <div className={cn(
              'px-1.5 py-0.5 text-[10px] font-medium rounded-full',
              'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
              'border border-cyan-500/20'
            )}>
              {t('app.beta')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}