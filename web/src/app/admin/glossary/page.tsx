
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Loader2 } from 'lucide-react';
import DeleteIconButton from '@/components/admin/DeleteIconButton';
import { getGlossaryPaged } from '@/actions/content';

export default function AdminGlossaryPage() {
    const [glossaryItems, setGlossaryItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchGlossary(1, true);
    }, []);

    const fetchGlossary = async (pageNum: number, isReset: boolean = false) => {
        setIsLoading(true);
        try {
            const result = await getGlossaryPaged(pageNum, 50); // Larger page size for glossary
            if (isReset) {
                setGlossaryItems(result.items);
            } else {
                setGlossaryItems(prev => [...prev, ...result.items]);
            }
            setHasMore(result.hasMore);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching glossary:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchGlossary(nextPage);
    };

    if (isLoading && glossaryItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-ochre" />
                <p className="text-lg uppercase font-black tracking-widest">Loading Glossary...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 md:pb-6 gap-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Glossary</h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Manage {total} terms and spiritual definitions</p>
                </div>
                <Link
                    href="/admin/glossary/new"
                    className="flex items-center justify-center space-x-2 bg-ochre text-white px-5 py-3 rounded-xl hover:bg-gold transition-all shadow-lg shadow-ochre/20 whitespace-nowrap active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-black text-xs uppercase tracking-widest">Add New Term</span>
                </Link>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Term</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {glossaryItems.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-ochre">{item.term}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link
                                            href={`/admin/glossary/${item.id}`}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors shadow-sm bg-white border border-gray-100"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <DeleteIconButton id={item.id} type="glossary" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Streamlined List */}
            <div className="md:hidden space-y-2">
                {glossaryItems.map((item: any) => (
                    <div key={item.id} className="bg-white py-2.5 px-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-3 transition-all active:bg-gray-50">
                        <h3 className="font-bold text-sm text-ochre tracking-tight truncate flex-1">{item.term}</h3>
                        <div className="flex items-center gap-1.5 flex-none">
                            <Link
                                href={`/admin/glossary/${item.id}`}
                                className="p-2 text-blue-500 bg-white rounded-lg transition-all border border-gray-100 shadow-sm active:scale-90"
                                aria-label="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </Link>
                            <DeleteIconButton id={item.id} type="glossary" />
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
                            "Explore More Terms"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
