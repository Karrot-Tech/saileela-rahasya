import prisma from '@/lib/db';
import GlossaryList from '@/components/features/GlossaryList';

export default async function GlossaryPage() {
    const glossaryData = await prisma.glossary.findMany({
        orderBy: { term: 'asc' }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-6 px-4">
            <GlossaryList initialData={glossaryData} />
        </div>
    );
}
