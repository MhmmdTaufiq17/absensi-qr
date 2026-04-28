import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataTable, DataTableRow, DataTableCell } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    shift_id: number | null;
    shift?: { name: string };
}

interface Shift {
    id: number;
    name: string;
}

interface Props {
    users: User[];
    shifts: Shift[];
}

const emptyForm = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    shift_id: '',
};

export default function UsersIndex({ users, shifts }: Props) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm(emptyForm);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(editingUser ? 'Memperbarui...' : 'Menyimpan...');

        const options = {
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
                toast.update(toastId, { render: 'Gagal! Cek input.', type: 'error', isLoading: false, autoClose: 3000 });
            },
        };

        if (editingUser) {
            put(`/users/${editingUser.id}`, options);
        } else {
            post('/users', options);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            shift_id: user.shift_id?.toString() ?? '',
        });
        setShowForm(true);
    };

    const handleDelete = (user: User) => {
        if (!confirm(`Hapus user "${user.name}"?`)) return;
        router.delete(`/users/${user.id}`, {
            onSuccess: () => toast.success('Berhasil dihapus'),
        });
    };

    const handleCancel = () => {
        setEditingUser(null);
        setShowForm(false);
        reset();
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Kelola User" />
            <ToastContainer position="top-right" theme="minimal" />

            <DataTable
                title="Kelola User"
                description="Manajemen data karyawan, hak akses, dan jadwal shift."
                headers={['Nama', 'Email', 'Role', 'Shift', 'Aksi']}
                action={
                    !showForm && (
                        <Button onClick={() => setShowForm(true)}>+ User Baru</Button>
                    )
                }
            >
                {users.map((user) => (
                    <DataTableRow key={user.id}>
                        <DataTableCell className="font-medium">{user.name}</DataTableCell>
                        <DataTableCell>{user.email}</DataTableCell>
                        <DataTableCell>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                                {user.role.toUpperCase()}
                            </span>
                        </DataTableCell>
                        <DataTableCell>
                            {user.shift ? (
                                <span className="text-xs">{user.shift.name}</span>
                            ) : (
                                <span className="text-xs text-muted-foreground italic">Belum ada</span>
                            )}
                        </DataTableCell>
                        <DataTableCell className="space-x-2">
                            <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline text-xs">Edit</button>
                            <button onClick={() => handleDelete(user)} className="text-red-600 hover:underline text-xs">Hapus</button>
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTable>

            {showForm && (
                <Card className="max-w-xl mx-auto border shadow-none">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            {editingUser ? `Edit: ${editingUser.name}` : 'Tambah User Baru'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label>Nama Lengkap</Label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <p className="text-red-500 text-[10px]">{errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Email</Label>
                                <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Password {editingUser && '(Kosongkan jika tidak ganti)'}</Label>
                                <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                                {errors.password && <p className="text-red-500 text-[10px]">{errors.password}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Role</Label>
                                    <select 
                                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Shift</Label>
                                    <select 
                                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                                        value={data.shift_id}
                                        onChange={e => setData('shift_id', e.target.value)}
                                    >
                                        <option value="">Pilih Shift...</option>
                                        {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>Batal</Button>
                                <Button type="submit" size="sm" disabled={processing}>Simpan User</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Karyawan', href: '/users' },
    ],
};
