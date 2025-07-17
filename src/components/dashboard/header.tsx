import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';
import Logo from '../logo';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Header() {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <>
            <SidebarTrigger />
            <Logo />
          </>
        )}
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
