
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveLeela, deleteLeela } from '@/actions/content';
import { useToast } from '@/context/ToastContext';
import { Save, Trash2, ArrowLeft, Eye, Edit3, Bold, Italic, List, Heading3, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface LeelaFormProps {
    leela?: any;
}

export default function LeelaForm({ leela }: LeelaFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: leela?.id || 'new',
        title_english: leela?.title_english || '',
        // title_hindi removed per new schema
        // chapter removed per new schema
        youtube_id: leela?.youtube_id || '',
        description: leela?.description || '',
        keywords: leela?.keywords?.join(', ') || '',
        social_tags: leela?.social_tags?.join(', ') || '',
        orderId: leela?.orderId || 0,
        // new fields
        story: leela?.story || '',
        doubt: leela?.doubt || '',
        revelation: leela?.revelation || '',
        scriptural_refs: leela?.scriptural_refs || '',
        transcript: leela?.transcript || '',
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
            await saveLeela(dataToSave);
            router.push('/admin/leela');
            router.refresh();
        } catch (error) {
            console.error('Failed to save:', error);
            showToast('Failed to save leela', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this leela?')) return;
        setLoading(true);
        try {
            await deleteLeela(leela.id);
            router.push('/admin/leela');
            router.refresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            showToast('Failed to delete leela', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Helper to insert markdown into the *active* textarea
    // Since we now have multiple textareas, we'll need to track which one is focused or just let user type manually for now to keep it simple.
    // However, to satisfy the 'redesign' request, we'll make a helper that inserts into the focused element if possible, 
    // or just keep the toolbar simpler. For now, let's keep it simple and just provide good textareas.

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Sticky Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-200/50 sticky top-20 z-40 gap-4">
                <Link href="/admin/leela" className="flex items-center text-gray-500 hover:text-ochre text-sm font-bold transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to List
                </Link>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {leela && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 sm:flex-none justify-center bg-red-50 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-100 transition-all flex items-center space-x-2 text-xs font-bold border border-red-100 active:scale-95"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 sm:flex-none justify-center bg-ochre text-white px-6 py-2.5 rounded-xl hover:bg-gold transition-all flex items-center space-x-2 shadow-lg shadow-ochre/20 text-xs font-black uppercase tracking-widest active:scale-95 border border-transparent"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Main Content (Story, etc) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Story Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center">
                                <span className="bg-ochre/10 text-ochre p-2 rounded-lg mr-3"><Heading3 className="w-5 h-5" /></span>
                                Main Story
                            </h2>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button type="button" onClick={() => setEditorMode('edit')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${editorMode === 'edit' ? 'bg-white shadow text-ochre' : 'text-gray-400'}`}>Write</button>
                                <button type="button" onClick={() => setEditorMode('preview')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${editorMode === 'preview' ? 'bg-white shadow text-ochre' : 'text-gray-400'}`}>Preview</button>
                            </div>
                        </div>

                        {editorMode === 'edit' ? (
                            <textarea
                                required
                                rows={15}
                                className="w-full p-4 border-2 border-transparent bg-gray-50 rounded-xl focus:border-ochre/30 focus:bg-white outline-none transition-all font-mono text-sm leading-relaxed resize-y"
                                placeholder="# Write the main Leela story here (Markdown supported)..."
                                value={formData.story}
                                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                            />
                        ) : (
                            <div className="prose prose-ochre max-w-none p-4 bg-gray-50 rounded-xl min-h-[300px]">
                                <ReactMarkdown>{formData.story}</ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Breakdown Sections: Doubt & Revelation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                            <h3 className="text-sm font-black text-gray-900 tracking-tight mb-3 flex items-center">
                                <span className="text-red-500 mr-2">❓</span> Doubt / Conflict
                            </h3>
                            <textarea
                                rows={8}
                                className="w-full flex-1 p-3 border border-gray-200 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm transition-all resize-none"
                                placeholder="Describe the doubt or conflict..."
                                value={formData.doubt}
                                onChange={(e) => setFormData({ ...formData, doubt: e.target.value })}
                            />
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                            <h3 className="text-sm font-black text-gray-900 tracking-tight mb-3 flex items-center">
                                <span className="text-ochre mr-2">💡</span> Revelation / Teaching
                            </h3>
                            <textarea
                                rows={8}
                                className="w-full flex-1 p-3 border border-gray-200 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm transition-all resize-none"
                                placeholder="Explain the revelation..."
                                value={formData.revelation}
                                onChange={(e) => setFormData({ ...formData, revelation: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Transcript & References */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-base font-black text-gray-900 tracking-tight">Source Material</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Scriptural References</label>
                                <input
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/30 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm font-medium"
                                    placeholder="e.g. Sai Satcharitra Ch 10, Bhagavad Gita 4.34"
                                    value={formData.scriptural_refs}
                                    onChange={(e) => setFormData({ ...formData, scriptural_refs: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Full Transcript</label>
                                <textarea
                                    rows={6}
                                    className="w-full p-3 border border-gray-200 bg-gray-50/30 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-xs text-gray-600 font-mono resize-y"
                                    placeholder="Paste the full video transcript here for reference..."
                                    value={formData.transcript}
                                    onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Metadata */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Basic Meta */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                        <h2 className="text-base font-black text-gray-900 tracking-tight">Metadata</h2>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title (English)</label>
                            <input
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm font-bold"
                                value={formData.title_english}
                                onChange={(e) => setFormData({ ...formData, title_english: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">YouTube ID</label>
                            <div className="flex items-center gap-2">
                                <div className="bg-red-50 p-2 rounded-lg text-red-600"><LinkIcon className="w-4 h-4" /></div>
                                <input
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm font-mono"
                                    placeholder="e.g. dQw4w9WgXcQ"
                                    value={formData.youtube_id}
                                    onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description (Short Summary)</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm resize-none"
                                placeholder="A brief summary for cards and SEO..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order / Priority</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-sm font-mono"
                                value={formData.orderId}
                                onChange={(e) => setFormData({ ...formData, orderId: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    {/* SEO & Tags */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                        <h2 className="text-base font-black text-gray-900 tracking-tight">SEO & Categorization</h2>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keywords</label>
                            <input
                                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-xs"
                                placeholder="comma, separated, keywords"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Social Tags</label>
                            <input
                                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none text-xs text-blue-600"
                                placeholder="#hashtag, #saibaba"
                                value={formData.social_tags}
                                onChange={(e) => setFormData({ ...formData, social_tags: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-ochre/5 p-4 rounded-2xl border border-ochre/10">
                        <h4 className="text-ochre font-bold text-xs uppercase tracking-widest mb-2 flex items-center">
                            <MdInfo className="w-4 h-4 mr-2" /> Tips
                        </h4>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                            Use <strong>bold</strong> for emphasis in Story. The ID is auto-generated. Ensure YouTube ID is correct for the video player to work.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
// Helper icon
function MdInfo({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>;
}
