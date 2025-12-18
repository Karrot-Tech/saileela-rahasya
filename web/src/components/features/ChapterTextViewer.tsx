'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { highlightGlossaryTerms } from '@/utils/textProcessor';
import GlossaryOverlay from './GlossaryOverlay';

interface GlossaryTerm {
    term: string;
    definition_en: string;
    definition_es: string;
    chapter: string;
}

export default function ChapterTextViewer({ text }: { text: string }) {
    const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

    const MarkdownComponents = {
        p: ({ children }: any) => (
            <p className="mb-4">
                {Array.isArray(children)
                    ? children.map((c, i) => typeof c === 'string' ? highlightGlossaryTerms(c, setSelectedTerm) : c)
                    : typeof children === 'string'
                        ? highlightGlossaryTerms(children, setSelectedTerm)
                        : children}
            </p>
        ),
        li: ({ children }: any) => (
            <li className="mb-2">
                {Array.isArray(children)
                    ? children.map((c, i) => typeof c === 'string' ? highlightGlossaryTerms(c, setSelectedTerm) : c)
                    : typeof children === 'string'
                        ? highlightGlossaryTerms(children, setSelectedTerm)
                        : children}
            </li>
        ),
        h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl font-bold mb-2 text-gray-700">{children}</h3>,
    };

    return (
        <div className="prose prose-ochre max-w-none text-gray-700 leading-relaxed font-serif text-lg">
            <ReactMarkdown components={MarkdownComponents}>
                {text}
            </ReactMarkdown>

            {selectedTerm && (
                <GlossaryOverlay
                    term={selectedTerm}
                    onClose={() => setSelectedTerm(null)}
                />
            )}
        </div>
    );
}
