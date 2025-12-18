'use client';

import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GlossaryTerm {
    term: string;
    definition_en: string;
    definition_es: string;
    chapter: string;
}

interface GlossaryOverlayProps {
    term: GlossaryTerm | null;
    onClose: () => void;
}

export default function GlossaryOverlay({ term, onClose }: GlossaryOverlayProps) {
    const { language } = useLanguage();

    if (!term) return null;

    const definition = language === 'es' ? term.definition_es : term.definition_en;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity pointer-events-auto"
                onClick={onClose}
            />

            {/* Card / Bottom Sheet */}
            <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border-t md:border border-ochre/20 p-8 max-w-lg w-full relative animate-in slide-in-from-bottom md:zoom-in duration-300 pointer-events-auto z-10">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-ochre/10 text-ochre text-xs font-bold rounded-full uppercase tracking-wider">
                        Glossary Term
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 leading-tight">{term.term}</h3>
                    <div className="h-0.5 w-12 bg-gold/50" />
                    <p className="text-gray-700 text-lg font-serif leading-relaxed">
                        {definition}
                    </p>
                    <div className="pt-4 flex items-center text-sm text-gray-400 font-medium">
                        <span className="w-6 h-px bg-gray-200 mr-2" />
                        Source: {term.chapter}
                    </div>
                </div>
            </div>
        </div>
    );
}
