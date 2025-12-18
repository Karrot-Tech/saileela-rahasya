import Link from 'next/link';
import prisma from '@/lib/db';
import { Lightbulb } from 'lucide-react';

export default async function BodhakathaPage() {
    const bodhakathaArticles = await prisma.bodhakatha.findMany({
        orderBy: { orderId: 'asc' }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 px-4">
            <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center text-ochre flex-none">
                    <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-ochre">Bodhakatha</h1>
                    <p className="text-sm text-gray-500 font-serif italic">"Instructional Stories & Wisdom"</p>
                </div>
            </div>

            <div className="grid gap-6">
                {bodhakathaArticles.map((article: any) => (
                    <Link
                        key={article.id}
                        href={`/bodhakatha/${article.id}`}
                        className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-gold transition-all group"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-white bg-ochre px-3 py-1 rounded-full self-start">
                                {article.theme}
                            </span>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-ochre transition-colors mt-2">
                                {article.title_english}
                            </h2>
                            <h3 className="text-base md:text-lg text-gray-400 font-serif">
                                {article.title_hindi}
                            </h3>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
