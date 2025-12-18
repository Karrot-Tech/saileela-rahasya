
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBodhakatha, deleteBodhakatha } from '@/actions/content';
import { Save, Trash2, ArrowLeft, Eye, Edit3, Bold, Italic, List, Heading3, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

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
    const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        const textarea = document.getElementById('description-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        textarea.focus();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const insertion = prefix + selection + suffix;

        // Try to use execCommand to preserve Undo/Redo buffer
        try {
            document.execCommand('insertText', false, insertion);
        } catch (e) {
            // Fallback for browsers that don't support execCommand 'insertText'
            const before = text.substring(0, start);
            const after = text.substring(end);
            const newText = before + insertion + after;
            setFormData({ ...formData, description: newText });
        }

        // Adjust selection if it was a wrapper (like **bold**)
        if (selection) {
            const newEnd = start + insertion.length;
            textarea.setSelectionRange(start, newEnd);
        } else {
            const newPos = start + prefix.length;
            textarea.setSelectionRange(newPos, newPos);
        }
    };

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
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10 gap-3">
                <Link href="/admin/bodhakatha" className="flex items-center text-gray-500 hover:text-gray-700 text-xs md:text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                </Link>
                <div className="flex items-center space-x-2 md:space-x-4 w-full sm:w-auto">
                    {bodhakatha && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 sm:flex-none justify-center bg-red-50 text-red-600 px-3 md:px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2 text-xs md:text-sm font-bold border border-red-100"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 sm:flex-none justify-center bg-ochre text-white px-4 md:px-6 py-2 rounded-lg hover:bg-gold transition-colors flex items-center space-x-2 shadow-lg shadow-ochre/20 text-xs md:text-sm font-black uppercase tracking-widest"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{loading ? 'Saving...' : 'Save Bodhakatha'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-base md:text-xl font-black text-gray-900 tracking-tight">Basic Information</h2>
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Theme</label>
                            <input
                                required
                                className="w-full px-3 py-2.5 md:p-2 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm md:text-base transition-all"
                                value={formData.theme}
                                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Title (English)</label>
                                <input
                                    required
                                    className="w-full px-3 py-2.5 md:p-2 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm md:text-base transition-all"
                                    value={formData.title_english}
                                    onChange={(e) => setFormData({ ...formData, title_english: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Title (Hindi)</label>
                                <input
                                    required
                                    className="w-full px-3 py-2.5 md:p-2 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none font-serif text-sm md:text-base transition-all"
                                    value={formData.title_hindi}
                                    onChange={(e) => setFormData({ ...formData, title_hindi: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 gap-3">
                                <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setEditorMode('edit')}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${editorMode === 'edit' ? 'bg-white text-ochre shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        <Edit3 className="w-3 h-3" />
                                        <span>Write</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditorMode('preview')}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${editorMode === 'preview' ? 'bg-white text-ochre shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        <Eye className="w-3 h-3" />
                                        <span>Preview</span>
                                    </button>
                                </div>

                                {editorMode === 'edit' && (
                                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 pr-2">
                                        <button type="button" onClick={() => insertMarkdown('### ')} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors shrink-0" title="Heading"><Heading3 className="w-4 h-4" /></button>
                                        <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors shrink-0" title="Bold"><Bold className="w-4 h-4" /></button>
                                        <button type="button" onClick={() => insertMarkdown('*', '*')} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors shrink-0" title="Italic"><Italic className="w-4 h-4" /></button>
                                        <button type="button" onClick={() => insertMarkdown('\n* ')} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors shrink-0" title="List"><List className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>

                            {editorMode === 'edit' ? (
                                <textarea
                                    id="description-textarea"
                                    required
                                    rows={14}
                                    className="w-full px-3 py-4 md:p-3 border-none bg-gray-50/30 rounded-xl focus:ring-0 outline-none text-sm leading-relaxed transition-all resize-none font-mono"
                                    placeholder="Type the spiritual story here... Use Markdown for styling."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            ) : (
                                <div className="prose prose-sm prose-ochre max-w-none px-3 py-4 md:p-6 bg-gray-50/30 rounded-2xl min-h-[400px]">
                                    <ReactMarkdown>{formData.description}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight">Metadata</h2>
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">YouTube ID</label>
                            <input
                                className="w-full px-3 py-2.5 md:p-2 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm transition-all"
                                value={formData.youtube_id}
                                onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Order ID (Weight)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2.5 md:p-2 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm transition-all"
                                value={formData.orderId}
                                onChange={(e) => setFormData({ ...formData, orderId: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight">Tags & SEO</h2>
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Keywords</label>
                            <input
                                className="w-full px-3 py-2.5 md:p-2 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm transition-all"
                                placeholder="guru, dev, sai"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Social Tags</label>
                            <input
                                className="w-full px-3 py-2.5 md:p-2 border border-gray-100 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm transition-all"
                                placeholder="spiritual, faith"
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
