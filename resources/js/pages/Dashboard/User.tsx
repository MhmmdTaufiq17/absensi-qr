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
    qrTimeLeft: number; // Sisa waktu dari server (akurat setelah full refresh)
}


export default function UserDashboard({ user, attendances, qrToken, qrTimeLeft }: Props) {

    // Gunakan sisa waktu dari server sebagai sumber kebenaran (akurat setelah full refresh)
    // localStorage hanya dipakai untuk menyinkronkan sisa waktu antar tab browser
    const getInitialTimeLeft = () => {
        const storedToken = localStorage.getItem('qr_token');
        const storedExpiresAt = localStorage.getItem('qr_expires_at');

        // Jika token sama dengan yang tersimpan, kita sedang dalam sesi yang sama
        // Percayai server (qrTimeLeft) sebagai sumber kebenaran
        if (storedToken === qrToken && storedExpiresAt) {
            // Ambil sisa waktu dari server (lebih akurat, menghindari bug refresh)
            return qrTimeLeft;
        }

        // Token berbeda → token baru (hasil Generate Ulang), simpan ke localStorage
        localStorage.setItem('qr_token', qrToken);
        localStorage.setItem('qr_expires_at', (Date.now() + qrTimeLeft * 1000).toString());
        return qrTimeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<number>(() => getInitialTimeLeft());

    useEffect(() => {
        // Jika waktu sudah habis, jangan jalankan interval
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    return 0; // Berhenti di 0, jangan auto-reload
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
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
                <CardContent className="flex flex-col items-center justify-center p-6 bg-white rounded-b-xl space-y-4 relative min-h-[300px]">
                    {timeLeft > 0 ? (
                        <>
                            <QRCode value={`user:${user.id}:${qrToken}`} size={200} />
                            <div className='mt-4 text-sm font-medium text-gray-500'>
                                Kode Akan Kedaluarsa Dalam <span className='text-red-500 font-bold'>{timeLeft}</span> detik
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full relative">
                            {/* Efek Blur pada QR Code lama */}
                            <div className="opacity-20 blur-sm pointer-events-none">
                                <QRCode value={`user:${user.id}:expired`} size={200} />
                            </div>
                            
                            {/* Overlay Tombol Generate Ulang */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                    Kedaluwarsa
                                </div>
                                <p className="text-sm text-gray-600 text-center mb-4 px-4">
                                    QR Code ini sudah tidak berlaku. Silakan buat yang baru untuk memindai.
                                </p>
                                <button 
                                    onClick={() => {
                                        router.reload({
                                            only: ['qrToken'],
                                            data: { regenerate: 1 }, // Kirim sinyal ke backend untuk force-generate token baru
                                            onSuccess: (page) => {
                                                const newToken = (page.props as any).qrToken as string;
                                                localStorage.setItem('qr_token', newToken);
                                                localStorage.setItem('qr_expires_at', (Date.now() + 60 * 1000).toString());
                                                setTimeLeft(60);
                                            }
                                        });
                                    }}
                                    className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-all active:scale-95"
                                >
                                    Generate Ulang QR
                                </button>
                            </div>
                        </div>
                    )}
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
