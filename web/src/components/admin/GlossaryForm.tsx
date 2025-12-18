
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
                <Link href="/admin/glossary" className="flex items-center text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                </Link>
                <div className="flex items-center space-x-4">
                    {glossary && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-ochre text-white px-6 py-2 rounded-lg hover:bg-gold transition-colors flex items-center space-x-2 shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save Term'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600">Term</label>
                                <input
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                    value={formData.term}
                                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600">Chapter / Reference</label>
                                <input
                                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                    value={formData.chapter}
                                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-bold text-gray-800">Definitions</h2>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">English Definition</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                value={formData.definition_en}
                                onChange={(e) => setFormData({ ...formData, definition_en: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Hindi Definition (Optional)</label>
                            <textarea
                                rows={4}
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre font-serif"
                                value={formData.definition_hi}
                                onChange={(e) => setFormData({ ...formData, definition_hi: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Spanish Definition (Optional)</label>
                            <textarea
                                rows={4}
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                value={formData.definition_es}
                                onChange={(e) => setFormData({ ...formData, definition_es: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
