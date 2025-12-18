import Link from 'next/link';
import prisma from '@/lib/db';
import { Footprints } from 'lucide-react';

export default async function LeelaPage() {
    const leelaArticles = await prisma.leela.findMany({
        orderBy: { orderId: 'asc' }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 px-4">
            <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center text-ochre flex-none">
                    <Footprints className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-ochre">Leela</h1>
                    <p className="text-sm text-gray-500 font-serif italic">"Devine plays of the Lord"</p>
                </div>
            </div>

            <div className="grid gap-6">
                {leelaArticles.map((article: any) => (
                    <Link
                        key={article.id}
                        href={`/leela/${article.id}`}
                        className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gold transition-all group active:scale-[0.98]"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <h2 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-ochre transition-colors">
                                    {article.title_english}
                                </h2>
                                <h3 className="text-base md:text-lg text-gray-400 font-serif">
                                    {article.title_hindi}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {article.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
