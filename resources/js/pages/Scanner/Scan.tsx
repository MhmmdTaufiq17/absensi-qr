import { Scanner } from "@yudiel/react-qr-scanner";
import { useState, useRef } from "react";
import { router, Head } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ScanProps {
    isScannerActive: boolean;
    scannerSetting: any;
}

export default function Scan({ isScannerActive, scannerSetting }: ScanProps) {
    const [scanning, setScanning] = useState(true);
    const [processing, setProcessing] = useState(false);
    const toastId = useRef<string | number | null>(null);

    const handleScan = (detectedCodes: any[]) => {
        if (detectedCodes && detectedCodes.length > 0 && !processing && scanning && isScannerActive) {
            const qrValue = detectedCodes[0].rawValue;

            setScanning(false);
            setProcessing(true);
            toastId.current = toast.loading("Memproses...");

            router.post('/dashboard/scan', { qr_code: qrValue }, {
                preserveScroll: true,
                onSuccess: (page: any) => {
                    const flash = page.props.flash;
                    if (flash?.error) {
                        toast.update(toastId.current!, { render: flash.error, type: 'error', isLoading: false, autoClose: 3000 });
                        setTimeout(() => { setScanning(true); setProcessing(false); }, 3500);
                    } else {
                        toast.update(toastId.current!, { render: flash?.success ?? 'Berhasil!', type: 'success', isLoading: false, autoClose: 2000 });
                        setTimeout(() => { setScanning(true); setProcessing(false); }, 2500);
                    }
                },
                onError: () => {
                    toast.update(toastId.current!, { render: 'Gagal memproses QR.', type: 'error', isLoading: false, autoClose: 3000 });
                    setTimeout(() => { setScanning(true); setProcessing(false); }, 3500);
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] space-y-8 p-6 bg-slate-50">
            <Head title="Absensi Kamera" />
            <ToastContainer position="top-center" theme="light" />

            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Scanner Kehadiran</h1>
                {isScannerActive ? (
                    <p className="text-muted-foreground">Silakan tunjukkan QR Code Anda ke kamera depan.</p>
                ) : (
                    <div className="text-red-600 font-bold bg-red-50 px-4 py-2 border border-red-200 rounded-lg shadow-sm animate-pulse">
                        Sistem Sedang Offline (Tutup)
                    </div>
                )}
            </div>

            <div className="relative w-full max-w-md aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200">
                {scanning && isScannerActive ? (
                    <Scanner
                        onScan={handleScan}
                        constraints={{ facingMode: "user" }}
                        styles={{
                            container: { width: "100%", height: "100%" },
                            video: { objectFit: "cover", width: "100%", height: "100%" }
                        }}
                    />
                ) : (
                    <div className="flex w-full h-full items-center justify-center bg-slate-100 flex-col space-y-4">
                         <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-sm font-medium text-slate-500">{!isScannerActive ? 'Scanner Tutup' : 'Pratinjau Kamera'}</p>
                    </div>
                )}
                
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-1/2 h-1/2 border-2 border-indigo-500/20 rounded-3xl"></div>
                </div>
            </div>

            <div className="text-xs text-muted-foreground flex gap-4">
                <span>🟢 Status: Online</span>
                {scannerSetting && <span>🕒 Jam: {scannerSetting.scanner_active_start} - {scannerSetting.scanner_active_end}</span>}
            </div>
        </div>
    );
}
