'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    actions?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl relative z-10 overflow-hidden transform transition-all animate-in slide-in-from-bottom duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="text-gray-600 mb-8">
                        {children}
                    </div>
                    {actions && (
                        <div className="grid grid-cols-2 gap-3">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
