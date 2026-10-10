import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Menu, User } from 'lucide-react';
import { loginWithRedirect, logout } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@project/components/ui/sheet';
import { Toaster } from '@project/components/ui/sonner';
import { cn } from '@project/components/lib/utils';
import Logo from './Logo';
import SocialGrid from './SocialGrid';
import MailingListForm from './MailingListForm';
import { useApp } from '../lib/AppContext';
import type { SectionKey } from '../lib/visibility';
import { COMPANY_SITE } from '../lib/socials';

type NavItem = { to: string; label: string; section?: SectionKey; roles?: string[] };
const NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/videos', label: 'Videos', section: 'youtube' },
  { to: '/browse', label: 'Series', section: 'browse' },
  { to: '/campaigns', label: 'Back a Project', section: 'campaigns' },
  { to: '/news', label: 'News', section: 'news' },
  { to: '/premium', label: 'Premium', section: 'premium' },
  { to: '/advertiser', label: 'Advertiser Hub', roles: ['Advertiser', 'Admin'] },
  { to: '/licensor', label: 'Licensor Hub', roles: ['Licensor', 'Admin'] },
  { to: '/admin', label: 'Admin', roles: ['Admin'] },
];

function useNav() {
  const { canSee, profile } = useApp();
  return NAV.filter((n) => (!n.section || canSee(n.section)) && (!n.roles || (profile && n.roles.includes(profile.role))));
}

function NavLinks({ onClick, vertical }: { onClick?: () => void; vertical?: boolean }) {
  const items = useNav();
  return (
    <nav className={cn('flex', vertical ? 'flex-col gap-1' : 'items-center gap-1')}>
      {items.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          onClick={onClick}
          className={({ isActive }) =>
            cn(
              'font-tech text-[0.65rem] uppercase tracking-[0.14em] px-3 py-2 rounded-md transition-colors whitespace-nowrap',
              isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary',
            )
          }
        >
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
}

function AccountButtons({ onClick }: { onClick?: () => void }) {
  const { signedIn, profile } = useApp();
  if (!signedIn)
    return (
      <Button size="sm" onClick={() => loginWithRedirect()} className="font-tech text-[0.65rem] uppercase tracking-widest">
        Sign in / Join
      </Button>
    );
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline" onClick={onClick}>
        <Link to="/account">
          {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" /> : <User className="h-4 w-4" />}
          <span className="max-w-[120px] truncate">{profile?.username ?? 'Account'}</span>
        </Link>
      </Button>
      <Button size="icon" variant="ghost" onClick={() => logout()} aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        <div className="hidden xl:block">
          <NavLinks />
        </div>
        <div className="hidden xl:block">
          <AccountButtons />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="xl:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 flex flex-col gap-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Logo height={32} />
            <NavLinks vertical onClick={() => setOpen(false)} />
            <AccountButtons onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function Footer() {
  const { canSee } = useApp();
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-16 space-y-16">
        {canSee('mailing') && <MailingListForm />}
        {canSee('socials') && <SocialGrid />}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground border-t border-border pt-8">
          <Logo height={32} />
          <a href={COMPANY_SITE} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            pressplayanime.neocities.org
          </a>
          <p>© {new Date().getFullYear()} Press Play International Media</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
