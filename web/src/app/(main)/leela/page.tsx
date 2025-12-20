import { Footprints } from 'lucide-react';
import LeelaList from '@/components/features/LeelaList';
import { getPublicLeelas } from '@/actions/content';

export const revalidate = 3600; // Revalidate every hour

export default async function LeelaPage() {
    const { items, total, hasMore } = await getPublicLeelas(1, 10);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 px-4 pb-20">
            <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center text-ochre flex-none">
                    <Footprints className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-ochre uppercase tracking-tight">Leela</h1>
                    <p className="text-sm text-gray-500 font-serif italic opacity-70">"Divine plays of the Lord"</p>
                </div>
            </div>

            <LeelaList initialItems={items} total={total} hasMoreInitial={hasMore} />
        </div>
    );
}
