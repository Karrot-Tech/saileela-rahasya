
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Loader2 } from 'lucide-react';
import DeleteIconButton from '@/components/admin/DeleteIconButton';
import { getBodhakathasPaged } from '@/actions/content';

export default function AdminBodhakathaPage() {
    const [bodhakathas, setBodhakathas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchBodhakathas(1, true);
    }, []);

    const fetchBodhakathas = async (pageNum: number, isReset: boolean = false) => {
        setIsLoading(true);
        try {
            const result = await getBodhakathasPaged(pageNum, 20);
            if (isReset) {
                setBodhakathas(result.items);
            } else {
                setBodhakathas(prev => [...prev, ...result.items]);
            }
            setHasMore(result.hasMore);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching bodhakathas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBodhakathas(nextPage);
    };

    if (isLoading && bodhakathas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-ochre" />
                <p className="text-lg uppercase font-black tracking-widest">Loading Bodhakatha...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 md:pb-6 gap-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Bodhakatha</h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Manage {total} instructional stories and wisdom teachings</p>
                </div>
                <Link
                    href="/admin/bodhakatha/new"
                    className="flex items-center justify-center space-x-2 bg-ochre text-white px-5 py-3 rounded-xl hover:bg-gold transition-all shadow-lg shadow-ochre/20 whitespace-nowrap active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-black text-xs uppercase tracking-widest">Add New Story</span>
                </Link>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Theme</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title (English)</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bodhakathas.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] uppercase font-black text-white bg-ochre px-2 py-0.5 rounded-md">
                                        {item.theme}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{item.title_english}</div>
                                    <div className="text-xs text-gray-400 font-serif italic">{item.title_hindi}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={`/admin/bodhakatha/${item.id}`}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors shadow-sm bg-white border border-gray-100"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <DeleteIconButton id={item.id} type="bodhakatha" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-2.5">
                {bodhakathas.map((item: any) => (
                    <div key={item.id} className="bg-white py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase font-black text-white bg-ochre px-2 py-0.5 rounded-md shadow-sm shadow-ochre/10">
                                {item.theme}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href={`/admin/bodhakatha/${item.id}`}
                                    className="p-2 text-blue-500 bg-white rounded-lg transition-all border border-gray-100 shadow-sm active:scale-90"
                                    aria-label="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <DeleteIconButton id={item.id} type="bodhakatha" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 leading-tight text-sm">{item.title_english}</h3>
                            <p className="text-[11px] text-gray-400 font-serif italic mt-0.5">{item.title_hindi}</p>
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
                            "Explore More Bodhakatha"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
