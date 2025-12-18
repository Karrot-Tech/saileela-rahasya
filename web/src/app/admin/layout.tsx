
import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClientWrapper from '@/components/admin/AdminClientWrapper';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side security check
    if (!await isAdmin()) {
        redirect('/');
    }

    return (
        <AdminClientWrapper>
            {children}
        </AdminClientWrapper>
    );
}
