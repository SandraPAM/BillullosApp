"use client";

import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  Target,
  Bot,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/budgets', label: 'Budgets', icon: Wallet },
  { href: '/dashboard/savings-goals', label: 'Savings Goals', icon: Target },
  { href: '/dashboard/tips', label: 'AI Tips', icon: Bot },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    // Placeholder for sign out logic
    console.log("Signing out...");
    // In a real app: await signOutUser(); router.push('/login');
  };

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  className="bg-sidebar text-sidebar-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton className="bg-sidebar text-sidebar-foreground">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} className="bg-sidebar text-sidebar-foreground">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
