import { Head,router } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { DataTable, DataTableRow, DataTableCell } from '@/components/data-table';

interface User {
    id: number;
    name: string;
}

interface Attendance {
    id: number;
    user: User;
    date: string;
    check_in: string | null;
    check_out: string | null;
    check_in_status: string | null;
    check_out_status: string | null;
}

interface Props {
    attendances: Attendance[];
}

export default function AttendancesIndex({ attendances }: Props) {
    useEchoPublic('attendance', '.scan.created', () => {
        router.reload({ only: ['attendances'] });
    });

    return (
        <div className="p-6 space-y-6">
            <Head title="Data Absensi" />
            
            <DataTable
                title="Data Absensi Karyawan"
                description="Monitoring histori absensi karyawan secara real-time."
                headers={['Nama Karyawan', 'Tanggal', 'Check In', 'Status Masuk', 'Check Out', 'Status Pulang']}
            >
                {attendances.length === 0 ? (
                    <DataTableRow>
                        <DataTableCell colSpan={6} className="text-center py-6 text-gray-500">
                            Belum ada data absensi
                        </DataTableCell>
                    </DataTableRow>
                ) : (
                    attendances.map((attendance) => (
                        <DataTableRow key={attendance.id}>
                            <DataTableCell className="font-medium">{attendance.user?.name || 'Unknown'}</DataTableCell>
                            <DataTableCell>{attendance.date}</DataTableCell>
                            <DataTableCell>{attendance.check_in || '-'}</DataTableCell>
                            <DataTableCell>
                                {attendance.check_in_status ? (
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                                        {attendance.check_in_status}
                                    </span>
                                ) : '-'}
                            </DataTableCell>
                            <DataTableCell>{attendance.check_out || '-'}</DataTableCell>
                            <DataTableCell>
                                {attendance.check_out_status ? (
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                                        {attendance.check_out_status}
                                    </span>
                                ) : '-'}
                            </DataTableCell>
                        </DataTableRow>
                    ))
                )}
            </DataTable>
        </div>
    );
}
