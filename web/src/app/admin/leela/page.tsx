
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Loader2, Bot } from 'lucide-react';
import DeleteIconButton from '@/components/admin/DeleteIconButton';
import { getLeelasPaged } from '@/actions/content';

export default function AdminLeelaPage() {
    const [leelas, setLeelas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchLeelas(1, true);
    }, []);

    const fetchLeelas = async (pageNum: number, isReset: boolean = false) => {
        setIsLoading(true);
        try {
            const result = await getLeelasPaged(pageNum, 20);
            if (isReset) {
                setLeelas(result.items);
            } else {
                setLeelas(prev => [...prev, ...result.items]);
            }
            setHasMore(result.hasMore);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching leelas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchLeelas(nextPage);
    };

    if (isLoading && leelas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-ochre" />
                <p className="text-lg uppercase font-black tracking-widest">Loading Leelas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 md:pb-6 gap-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Leela Stories</h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Manage {total} stories and plays of Sai Baba</p>
                </div>
                <Link
                    href="/admin/leela/generate"
                    className="flex items-center justify-center space-x-2 bg-ochre text-white px-5 py-3 rounded-xl hover:bg-gold transition-all shadow-lg shadow-ochre/20 whitespace-nowrap active:scale-95"
                >
                    <Bot className="w-5 h-5" />
                    <span className="font-black text-xs uppercase tracking-widest">AI Generator</span>
                </Link>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title (English)</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leelas.map((leela: any) => (
                            <tr key={leela.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{leela.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{leela.title_english}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={`/admin/leela/${leela.id}`}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors shadow-sm bg-white border border-gray-100"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <DeleteIconButton id={leela.id} type="leela" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-2.5">
                {leelas.map((leela: any) => (
                    <div key={leela.id} className="bg-white py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center gap-2.5">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 leading-tight text-sm">{leela.title_english}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Link
                                href={`/admin/leela/${leela.id}`}
                                className="p-2 text-blue-500 bg-white rounded-lg transition-all border border-gray-100 shadow-sm active:scale-90"
                            >
                                <Edit className="w-4 h-4" />
                            </Link>
                            <DeleteIconButton id={leela.id} type="leela" />
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-8 pb-12">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="bg-white text-ochre px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-ochre/20 hover:bg-orange-50 transition-all flex items-center shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Explore More Leelas"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
