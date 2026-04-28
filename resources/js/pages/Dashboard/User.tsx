import { Head } from '@inertiajs/react';
import QRCodeOriginal from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QRCode = (QRCodeOriginal as any).default || QRCodeOriginal;

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
    }
}

export default function UserDashboard({ user }: Props) {
    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-6">
            <Head title="My QR Code" />

            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Halo, {user.name}!</h1>
                <p className="text-muted-foreground text-sm">Tunjukkan QR Code ini ke petugas scanner untuk melakukan absensi.</p>
            </div>

            <Card className="w-full max-w-sm border shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">My Attendance QR</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center p-6 bg-white rounded-b-xl">
                    <QRCode value={`user:${user.id}`} size={200} />
                </CardContent>
            </Card>

        </div>
    );
}
