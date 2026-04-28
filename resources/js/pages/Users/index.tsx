import { Head } from '@inertiajs/react';
import { index as userIndexRoute } from '@/routes/users';


export default function UsersIndex() {
    return (
        <>
            <Head title="Manage User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manage User',
            href: userIndexRoute(),
        },
    ],
};
