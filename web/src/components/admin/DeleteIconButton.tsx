
'use client';

import { deleteLeela, deleteBodhakatha, deleteGlossary } from '@/actions/content';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteIconButtonProps {
    id: string;
    type: 'leela' | 'bodhakatha' | 'glossary';
}

export default function DeleteIconButton({ id, type }: DeleteIconButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

        setLoading(true);
        try {
            if (type === 'leela') await deleteLeela(id);
            else if (type === 'bodhakatha') await deleteBodhakatha(id);
            else if (type === 'glossary') await deleteGlossary(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className={`p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm bg-white border border-gray-100 disabled:opacity-50 ${loading ? 'animate-pulse' : ''}`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
