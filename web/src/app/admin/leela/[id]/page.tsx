
import prisma from '@/lib/db';
import LeelaForm from '@/components/admin/LeelaForm';
import { notFound } from 'next/navigation';

export default async function AdminLeelaEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let leela = null;
    if (id !== 'new') {
        leela = await prisma.leela.findUnique({
            where: { id }
        });
        if (!leela) notFound();
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {id === 'new' ? 'Add New Leela' : 'Edit Leela'}
            </h1>
            <LeelaForm leela={leela} />
        </div>
    );
}
