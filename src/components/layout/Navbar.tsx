
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { Logo } from './Logo';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { LanguageToggle } from '@/components/language/LanguageToggle';

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-14 px-4 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Logo showBeta={true} className="ml-0" />
        </div>
        <div className="flex items-center gap-3">
          <NotificationCenter />
          <LanguageToggle />
          <UserMenu />
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
} 