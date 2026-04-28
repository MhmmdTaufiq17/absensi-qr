import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataTable, DataTableRow, DataTableCell } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Shift {
    id: number;
    name: string;
    check_in_start: string;
    check_in_end: string;
    check_out_start: string;
    check_out_end: string;
    is_active: boolean;
}

interface Props {
    shifts: Shift[];
}

const emptyForm = {
    name: '',
    check_in_start: '',
    check_in_end: '',
    check_out_start: '',
    check_out_end: ''
};

export default function ShiftsIndex({ shifts }: Props) {
    const [editingShift, setEditingShift] = useState<Shift | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm(emptyForm);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(editingShift ? 'Memperbarui...' : 'Menyimpan...');

        const options = {
            preserveScroll: true,
            onSuccess: (page: any) => {
                const flash = page.props.flash;
                if (flash?.error) {
                    toast.update(toastId, { render: flash.error, type: 'error', isLoading: false, autoClose: 3000 });
                } else {
                    toast.update(toastId, { render: flash?.success ?? 'Berhasil!', type: 'success', isLoading: false, autoClose: 2000 });
                    handleCancel();
                }
            },
            onError: () => {
                toast.update(toastId, { render: 'Validasi gagal.', type: 'error', isLoading: false, autoClose: 3000 });
            },
        };

        if (editingShift) {
            put(`/dashboard/shifts/${editingShift.id}`, options);
        } else {
            post('/dashboard/shifts', options);
        }
    };

    const handleEdit = (shift: Shift) => {
        setEditingShift(shift);
        setData({
            name: shift.name,
            check_in_start: shift.check_in_start.slice(0, 5),
            check_in_end: shift.check_in_end.slice(0, 5),
            check_out_start: shift.check_out_start.slice(0, 5),
            check_out_end: shift.check_out_end.slice(0, 5),
        });
        setShowForm(true);
    };

    const handleDelete = (shift: Shift) => {
        if (!confirm(`Hapus shift "${shift.name}"?`)) return;
        router.delete(`/dashboard/shifts/${shift.id}`, {
            onSuccess: () => toast.success('Berhasil dihapus'),
        });
    };

    const handleToggle = (shift: Shift) => {
        router.post(`/dashboard/shifts/${shift.id}/toggle`, {}, {
            onSuccess: () => toast.success('Status diperbarui'),
        });
    };

    const handleCancel = () => {
        setEditingShift(null);
        setShowForm(false);
        reset();
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Kelola Shift" />
            <ToastContainer position="top-right" theme="minimal" />

            <DataTable
                title="Kelola Shift"
                description="Atur jadwal masuk dan pulang karyawan secara sederhana."
                headers={['Nama', 'Check In', 'Check Out', 'Status', 'Aksi']}
                action={
                    !showForm && (
                        <Button onClick={() => setShowForm(true)}>+ Tambah Shift</Button>
                    )
                }
            >
                {shifts.map((shift) => (
                    <DataTableRow key={shift.id}>
                        <DataTableCell className="font-medium">{shift.name}</DataTableCell>
                        <DataTableCell>{shift.check_in_start.slice(0, 5)} - {shift.check_in_end.slice(0, 5)}</DataTableCell>
                        <DataTableCell>{shift.check_out_start.slice(0, 5)} - {shift.check_out_end.slice(0, 5)}</DataTableCell>
                        <DataTableCell>
                            <span 
                                onClick={() => handleToggle(shift)}
                                className={`cursor-pointer px-2 py-1 rounded text-xs font-bold ${shift.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {shift.is_active ? 'AKTIF' : 'NONAKTIF'}
                            </span>
                        </DataTableCell>
                        <DataTableCell className="space-x-2">
                            <button onClick={() => handleEdit(shift)} className="text-blue-600 hover:underline text-xs">Edit</button>
                            <button onClick={() => handleDelete(shift)} className="text-red-600 hover:underline text-xs">Hapus</button>
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTable>

            {showForm && (
                <Card className="max-w-2xl mx-auto shadow-none border">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground text-center">
                            {editingShift ? 'Edit Shift' : 'Tambah Shift Baru'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Shift</Label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Check-In Start</Label>
                                    <Input type="time" value={data.check_in_start} onChange={e => setData('check_in_start', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Check-In End</Label>
                                    <Input type="time" value={data.check_in_end} onChange={e => setData('check_in_end', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Check-Out Start</Label>
                                    <Input type="time" value={data.check_out_start} onChange={e => setData('check_out_start', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Check-Out End</Label>
                                    <Input type="time" value={data.check_out_end} onChange={e => setData('check_out_end', e.target.value)} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={handleCancel}>Batal</Button>
                                <Button type="submit" disabled={processing}>{editingShift ? 'Simpan Perubahan' : 'Simpan Shift'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
