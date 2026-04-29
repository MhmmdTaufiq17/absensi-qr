import { Head,router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import QRCodeOriginal from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, DataTableRow, DataTableCell } from '@/components/data-table';

const QRCode = (QRCodeOriginal as any).default || QRCodeOriginal;

interface Attendance {
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
    check_in_status: string | null;
    check_out_status: string | null;
}

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
    };
    attendances: Attendance[];
    qrToken: string;
}


export default function UserDashboard({ user, attendances, qrToken }: Props) {

    const getInitialTimeLeft = () => {

        const storedToken = localStorage.getItem('qr_token');
        const storedExpiresAt = localStorage.getItem('qr_expires_at');


        if (storedToken === qrToken && storedExpiresAt) {
            const remaining = Math.floor((parseInt (storedExpiresAt) - Date.now()) / 1000 );
            return remaining > 0 ? remaining : 0;
        }

        localStorage.setItem('qr_token', qrToken);
        localStorage.setItem('qr_expires_at', (Date.now() + 60 * 1000).toString());
        return 60;        
    }

    const [timeLeft, setTimeLeft] = useState(() => getInitialTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    router.reload({
                        only: ['qrToken'],
                        onSuccess: () => {
                            setTimeLeft(60);
                        }
                    });
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    return (
        <div className="p-6 flex flex-col items-center min-h-[80vh] space-y-8 max-w-4xl mx-auto w-full">
            <Head title="Dashboard Karyawan" />

            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Halo, {user.name}!</h1>
                <p className="text-muted-foreground text-sm">Tunjukkan QR Code ini ke petugas scanner untuk melakukan absensi.</p>
            </div>

            <Card className="w-full max-w-sm border shadow-none">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">My Attendance QR</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6 bg-white rounded-b-xl space-y-4">
                    <QRCode value={`user:${user.id}:${qrToken}`} size={200} />
                    <div className='mt-4 text-sm font-medium text-gray-500'>
                        Kode Akan Kedaluarsa Dalam <span className='text-red-500 font-bold'>{timeLeft}</span> detik
                    </div>
                </CardContent>
            </Card>

            <div className="w-full space-y-4 pb-10">
                <DataTable
                    title="Histori Absensi Terakhir"
                    description="Daftar kehadiran Anda dalam 7 hari terakhir."
                    headers={['Tanggal', 'Masuk', 'Pulang', 'Status']}
                >
                    {attendances.length === 0 ? (
                        <DataTableRow>
                            <DataTableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                Belum ada riwayat absensi.
                            </DataTableCell>
                        </DataTableRow>
                    ) : (
                        attendances.map((attendance) => (
                            <DataTableRow key={attendance.id}>
                                <DataTableCell className="font-medium text-xs">{attendance.date}</DataTableCell>
                                <DataTableCell className="text-xs">{attendance.check_in?.slice(0, 5) || '-'}</DataTableCell>
                                <DataTableCell className="text-xs">{attendance.check_out?.slice(0, 5) || '-'}</DataTableCell>
                                <DataTableCell>
                                    <div className="flex flex-col gap-1">
                                        {attendance.check_in_status && (
                                            <span className="text-[10px] font-bold text-green-600 uppercase leading-none">{attendance.check_in_status}</span>
                                        )}
                                        {attendance.check_out_status && (
                                            <span className="text-[10px] font-bold text-blue-600 uppercase leading-none">{attendance.check_out_status}</span>
                                        )}
                                        {!attendance.check_in_status && !attendance.check_out_status && '-'}
                                    </div>
                                </DataTableCell>
                            </DataTableRow>
                        ))
                    )}
                </DataTable>
            </div>
        </div>
    );
}
