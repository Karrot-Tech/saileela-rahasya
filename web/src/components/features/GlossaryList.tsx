
'use client';

import { useState, useMemo } from 'react';
import SearchBar from '@/components/features/SearchBar';
import { useLanguage } from '@/context/LanguageContext';

interface GlossaryItem {
    id: string;
    term: string;
    chapter: string | null;
    definition_en: string;
    definition_es: string | null;
    definition_hi: string | null;
}

interface GlossaryListProps {
    initialData: GlossaryItem[];
}

type SortOrder = 'asc' | 'desc';

export default function GlossaryList({ initialData }: GlossaryListProps) {
    const { language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const getDefinition = (item: GlossaryItem) => {
        if (language === 'es') return item.definition_es || item.definition_en;
        if (language === 'hi') return item.definition_hi || item.definition_en;
        return item.definition_en;
    };

    const filteredData = useMemo(() => {
        let data = initialData.filter((item) => {
            const termMatch = item.term.toLowerCase().includes(searchQuery.toLowerCase());
            const defMatch = getDefinition(item).toLowerCase().includes(searchQuery.toLowerCase());
            return termMatch || defMatch;
        });

        data = data.sort((a, b) => {
            const compareA = a.term.toLowerCase();
            const compareB = b.term.toLowerCase();
            return sortOrder === 'asc'
                ? compareA.localeCompare(compareB)
                : compareB.localeCompare(compareA);
        });

        return data;
    }, [searchQuery, sortOrder, language, initialData]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center text-ochre flex-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-ochre">Glossary</h1>
                    <p className="text-sm text-gray-500 font-serif italic">"Sacred terms and wisdom"</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="flex items-center space-x-4 w-full md:w-auto md:pr-16">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search terms or definitions..."
                    />

                    <button
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 whitespace-nowrap"
                    >
                        {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-gold transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold text-ochre mb-2">{item.term}</h2>
                            </div>
                            <p className="text-gray-700 font-serif text-lg leading-relaxed">
                                {getDefinition(item)}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No terms found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}
