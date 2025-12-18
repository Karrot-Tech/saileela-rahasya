
import prisma from '@/lib/db';
import GlossaryForm from '@/components/admin/GlossaryForm';
import { notFound } from 'next/navigation';

export default async function AdminGlossaryEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let glossary = null;
    if (id !== 'new') {
        glossary = await prisma.glossary.findUnique({
            where: { id }
        });
        if (!glossary) notFound();
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {id === 'new' ? 'Add New Term' : 'Edit Term'}
            </h1>
            <GlossaryForm glossary={glossary} />
        </div>
    );
}
