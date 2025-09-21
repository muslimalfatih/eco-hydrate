'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthContext";
import { supabaseBrowser } from "@/lib/supabase";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3Icon,
  HomeIcon,
  PackageIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  BellIcon,
  SearchIcon,
  ChevronUpIcon,
  ActivityIcon,
  ShoppingCartIcon,
  FileTextIcon,
  HelpCircleIcon,
} from "lucide-react";

// Navigation items following shadcn/ui patterns
const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeIcon,
    isActive: true,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3Icon,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCartIcon,
  },
  {
    title: "Products",
    url: "/products",
    icon: PackageIcon,
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: UsersIcon,
  },
];

const secondaryItems = [
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileTextIcon,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: SettingsIcon,
  },
  {
    title: "Help",
    url: "/dashboard/help",
    icon: HelpCircleIcon,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    // Show loading toast
    const loadingToast = toast.loading('Signing you out...', {
      description: 'Please wait while we log you out securely'
    });

    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success toast
      toast.success('Signed out successfully', {
        description: 'You have been logged out of your account',
        duration: 3000,
      });
      
      // Navigate to login
      router.replace('/login');
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show error toast
      toast.error('Sign out failed', {
        description: 'There was an error signing you out. Please try again.',
        action: {
          label: 'Retry',
          onClick: () => handleSignOut(),
        },
      });
    }
  };

  // Get user initials for avatar fallback
  const userInitials = user?.email
    ? user.email
        .split('@')[0]
        .split('.')
        .map(name => name.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
    : 'U';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <ActivityIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Eco-Hydrate</span>
                    <span className="truncate text-xs">Dashboard</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="" alt={user?.email || ''} />
                      <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.email?.split('@')[0] || 'User'}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronUpIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="" alt={user?.email || ''} />
                        <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.email?.split('@')[0] || 'User'}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <SettingsIcon />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/help">
                        <HelpCircleIcon />
                        Support
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Top Navigation Bar */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
