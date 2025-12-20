
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { getPublicBodhakathas } from '@/actions/content';

interface BodhakathaListProps {
    initialItems: any[];
    total: number;
    hasMoreInitial: boolean;
}

export default function BodhakathaList({ initialItems, total, hasMoreInitial }: BodhakathaListProps) {
    const [items, setItems] = useState(initialItems);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(hasMoreInitial);
    const [isLoading, setIsLoading] = useState(false);

    // Safety stop: Auto-scroll until page 4, then require manual click
    const AUTO_PAGES_LIMIT = 4;

    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const result = await getPublicBodhakathas(nextPage, 10);
            setItems(prev => [...prev, ...result.items]);
            setHasMore(result.hasMore);
            setPage(nextPage);
        } catch (error) {
            console.error('Error loading more bodhakathas:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore, isLoading]);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        // Only auto-trigger if we haven't reached the safety limit
        if (page >= AUTO_PAGES_LIMIT) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMore, hasMore, isLoading, page]);

    return (
        <div className="grid gap-6">
            {items.map((article: any) => (
                <Link
                    key={article.id}
                    href={`/bodhakatha/${article.id}`}
                    className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-gold transition-all group animate-in fade-in slide-in-from-bottom-2 duration-500"
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

            {hasMore && (
                <div ref={observerTarget} className="flex justify-center pt-8 pb-12">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="bg-white text-ochre px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-ochre/20 hover:bg-orange-50 transition-all flex items-center shadow-lg shadow-ochre/5 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading More...
                            </>
                        ) : (
                            page < AUTO_PAGES_LIMIT ? "Scrolling for more..." : "Explore More Bodhakatha"
                        )}
                    </button>
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest py-8">
                    You have explored all {total} Bodhakathas
                </p>
            )}
        </div>
    );
}
