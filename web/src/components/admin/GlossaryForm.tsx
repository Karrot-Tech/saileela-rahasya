
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveGlossary, deleteGlossary } from '@/actions/content';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
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

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this term?')) return;
        setLoading(true);
        try {
            await deleteGlossary(glossary.id);
            router.push('/admin/glossary');
            router.refresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete glossary term');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-16 lg:top-0 z-30 gap-4">
                <Link href="/admin/glossary" className="flex items-center text-gray-400 hover:text-ochre text-xs font-black uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                </Link>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {glossary && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 sm:flex-none justify-center bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest border border-red-100 active:scale-95 whitespace-nowrap"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 sm:flex-none justify-center bg-ochre text-white px-6 py-2.5 rounded-xl hover:bg-gold transition-all flex items-center space-x-2 shadow-lg shadow-ochre/20 text-[10px] font-black uppercase tracking-widest active:scale-95 whitespace-nowrap"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{loading ? 'Saving...' : 'Save Term'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10">
                {/* Side Panel: Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">Essential Info</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Core term details</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Term</label>
                                <input
                                    required
                                    placeholder="e.g. Bhiksha"
                                    className="w-full px-4 py-3 border border-gray-50 bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-base font-medium transition-all"
                                    value={formData.term}
                                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference</label>
                                <input
                                    placeholder="e.g. Chapter 8"
                                    className="w-full px-4 py-3 border border-gray-50 bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-base font-medium transition-all"
                                    value={formData.chapter}
                                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Definitions */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Definitions</h2>
                            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">Multi-lingual spiritual context</p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-ochre uppercase tracking-widest ml-1">English Definition (Primary)</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Enter the English meaning..."
                                    className="w-full px-5 py-4 border border-gray-50 bg-gray-50/30 rounded-[2rem] focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-[15px] leading-relaxed font-medium transition-all resize-none shadow-inner"
                                    value={formData.definition_en}
                                    onChange={(e) => setFormData({ ...formData, definition_en: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hindi Translation</label>
                                    <textarea
                                        rows={4}
                                        placeholder="हिन्दी अर्थ..."
                                        className="w-full px-5 py-4 border border-gray-50 bg-gray-50/30 rounded-[2rem] focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-[17px] leading-relaxed font-serif transition-all resize-none shadow-inner"
                                        value={formData.definition_hi}
                                        onChange={(e) => setFormData({ ...formData, definition_hi: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Spanish Translation</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Definición en español..."
                                        className="w-full px-5 py-4 border border-gray-50 bg-gray-50/30 rounded-[2rem] focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none text-[15px] leading-relaxed font-medium transition-all resize-none shadow-inner"
                                        value={formData.definition_es}
                                        onChange={(e) => setFormData({ ...formData, definition_es: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-10 pb-6 flex justify-center">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-ochre text-white px-12 py-4 rounded-3xl hover:bg-gold transition-all flex items-center justify-center space-x-3 shadow-xl shadow-ochre/30 text-xs md:text-sm font-black uppercase tracking-widest active:scale-95"
                >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving Changes...' : 'Save Term'}</span>
                </button>
            </div>
        </form>
    );
}
