import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, QrCode, Calendar, ClipboardList } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const adminNavItems: NavItem[] = [];

    // Menu untuk admin
    if ((auth.user as any).role === 'admin') {
        adminNavItems.push({
            title: 'Setting Shift',
            href: '/dashboard/shifts',
            icon: Calendar,
        });

        adminNavItems.push({
            title: 'Data Karyawan',
            href: '/dashboard/users',
            icon: Users,
        });

        adminNavItems.push({
            title: 'Absensi Kamera',
            href: '/dashboard/scan',
            icon: QrCode,
        });

        adminNavItems.push({
            title: 'Data Absensi',
            href: '/dashboard/attendances',
            icon: ClipboardList,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                <NavMain items={mainNavItems} title="Utama" />
                
                {adminNavItems.length > 0 && (
                    <>
                        <SidebarSeparator className="mx-2" />
                        <NavMain items={adminNavItems} title="Manajemen" />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
