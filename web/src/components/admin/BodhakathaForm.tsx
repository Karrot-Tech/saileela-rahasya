
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBodhakatha, deleteBodhakatha } from '@/actions/content';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BodhakathaFormProps {
    bodhakatha?: any;
}

export default function BodhakathaForm({ bodhakatha }: BodhakathaFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: bodhakatha?.id || 'new',
        theme: bodhakatha?.theme || '',
        title_english: bodhakatha?.title_english || '',
        title_hindi: bodhakatha?.title_hindi || '',
        youtube_id: bodhakatha?.youtube_id || '',
        description: bodhakatha?.description || '',
        keywords: bodhakatha?.keywords?.join(', ') || '',
        social_tags: bodhakatha?.social_tags?.join(', ') || '',
        orderId: bodhakatha?.orderId || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                keywords: formData.keywords.split(',').map((s: string) => s.trim()).filter(Boolean),
                social_tags: formData.social_tags.split(',').map((s: string) => s.trim()).filter(Boolean),
                orderId: Number(formData.orderId),
            };
            await saveBodhakatha(dataToSave);
            router.push('/admin/bodhakatha');
            router.refresh();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save bodhakatha');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this bodhakatha?')) return;
        setLoading(true);
        try {
            await deleteBodhakatha(bodhakatha.id);
            router.push('/admin/bodhakatha');
            router.refresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete bodhakatha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
                <Link href="/admin/bodhakatha" className="flex items-center text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                </Link>
                <div className="flex items-center space-x-4">
                    {bodhakatha && (
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
                        <span>{loading ? 'Saving...' : 'Save Bodhakatha'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Theme</label>
                            <input
                                required
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                value={formData.theme}
                                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600">Title (English)</label>
                                <input
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent outline-none"
                                    value={formData.title_english}
                                    onChange={(e) => setFormData({ ...formData, title_english: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600">Title (Hindi)</label>
                                <input
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent outline-none font-serif"
                                    value={formData.title_hindi}
                                    onChange={(e) => setFormData({ ...formData, title_hindi: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Description / Content</label>
                            <textarea
                                required
                                rows={10}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent outline-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Metadata</h2>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">YouTube ID</label>
                            <input
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                value={formData.youtube_id}
                                onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Order ID (Weight)</label>
                            <input
                                type="number"
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                value={formData.orderId}
                                onChange={(e) => setFormData({ ...formData, orderId: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Tags & SEO</h2>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Keywords (comma-separated)</label>
                            <input
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Social Tags (comma-separated)</label>
                            <input
                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-ochre"
                                value={formData.social_tags}
                                onChange={(e) => setFormData({ ...formData, social_tags: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
