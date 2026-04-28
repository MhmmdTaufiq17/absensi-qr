import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    return (
        <div className="p-6 space-y-6">
            <Head title="Admin Dashboard" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
                    <p className="text-sm text-muted-foreground">Monitor dan kelola sistem absensi QR.</p>
                </div>
                <Link href="/dashboard/scan">
                    <Button className="flex items-center gap-2 shadow-sm">
                        <Camera className="h-4 w-4" />
                        Buka Absensi Kamera
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/dashboard/users">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer border shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Data Karyawan</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Kelola</div>
                            <p className="text-xs text-muted-foreground">Tambah, edit, dan atur shift karyawan.</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/shifts">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer border shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Setting Shift</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Atur Jam</div>
                            <p className="text-xs text-muted-foreground">Konfigurasi window waktu masuk/pulang.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
    ],
};
