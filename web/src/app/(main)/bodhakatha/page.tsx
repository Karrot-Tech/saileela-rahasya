
import { Lightbulb } from 'lucide-react';
import BodhakathaList from '@/components/features/BodhakathaList';
import { getPublicBodhakathas } from '@/actions/content';

export const revalidate = 3600; // Revalidate every hour

export default async function BodhakathaPage() {
    const { items, total, hasMore } = await getPublicBodhakathas(1, 10);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 px-4 pb-20">
            <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center text-ochre flex-none">
                    <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-ochre uppercase tracking-tight">Bodhakatha</h1>
                    <p className="text-sm text-gray-500 font-serif italic opacity-70">"Instructional Stories & Wisdom"</p>
                </div>
            </div>

            <BodhakathaList initialItems={items} total={total} hasMoreInitial={hasMore} />
        </div>
    );
}
