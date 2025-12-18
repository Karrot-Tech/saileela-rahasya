'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveGlossary, deleteGlossary } from '@/actions/content';
import { Save, ArrowLeft } from 'lucide-react';
import DeleteIconButton from '@/components/admin/DeleteIconButton';
import Link from 'next/link';

interface GlossaryFormProps {
    glossary?: any;
}

export default function GlossaryForm({ glossary }: GlossaryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: glossary?.id || 'new',
        term: glossary?.term || '',
        chapter: glossary?.chapter || '',
        definition_en: glossary?.definition_en || '',
        definition_es: glossary?.definition_es || '',
        definition_hi: glossary?.definition_hi || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveGlossary(formData);
            router.push('/admin/glossary');
            router.refresh();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save glossary term');
        } finally {
            setLoading(false);
        }
    };

    // handleDelete function is no longer needed as DeleteIconButton handles the action

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-md border border-gray-100 sticky top-16 lg:top-0 z-30 gap-3">
                <Link href="/admin/glossary" className="flex items-center text-gray-400 hover:text-ochre text-xs font-black uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                </Link>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {glossary && (
                        <DeleteIconButton id={glossary.id} type="glossary" />
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 sm:flex-none justify-center bg-ochre text-white px-6 py-2.5 rounded-xl hover:bg-gold transition-all flex items-center space-x-2 shadow-lg shadow-ochre/20 text-[10px] font-black uppercase tracking-widest active:scale-95 whitespace-nowrap min-h-[42px] border border-transparent"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{loading ? 'Saving...' : 'Save Term'}</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4 md:space-y-6 max-w-4xl">
                {/* Basic Info Card */}
                <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Term</label>
                            <input
                                required
                                placeholder="e.g. Bhiksha"
                                className="w-full px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-base font-bold transition-all"
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference / Chapter</label>
                            <input
                                placeholder="e.g. Chapter 8"
                                className="w-full px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-base font-medium transition-all"
                                value={formData.chapter}
                                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black text-ochre uppercase tracking-widest">English Definition</label>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{formData.definition_en.length} chars</span>
                        </div>
                        <textarea
                            required
                            rows={6}
                            placeholder="Enter the spiritual meaning or context..."
                            className="w-full px-4 py-4 border border-gray-100 bg-gray-50/30 rounded-2xl focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-[15px] leading-relaxed font-medium transition-all resize-none shadow-inner"
                            value={formData.definition_en}
                            onChange={(e) => setFormData({ ...formData, definition_en: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-6 pb-6 flex justify-center">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-ochre text-white px-10 py-3.5 rounded-2xl hover:bg-gold transition-all flex items-center justify-center space-x-3 shadow-xl shadow-ochre/30 text-xs font-black uppercase tracking-widest active:scale-95"
                >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving Changes...' : 'Save Term'}</span>
                </button>
            </div>
        </form>
    );
}
