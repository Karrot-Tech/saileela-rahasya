'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose: () => void;
    duration?: number;
}

export function Notification({ message, type, onClose, duration = 5000 }: NotificationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const bgColor = type === 'success' ? 'bg-ochre' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? XCircle : CheckCircle2;

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform 
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
            <div className={`${bgColor} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 min-w-[300px] max-w-[90vw] border border-white/20 backdrop-blur-md`}>
                <div className="bg-white/20 p-1.5 rounded-full">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <p className="font-semibold flex-grow text-sm tracking-wide">{message}</p>
                <button
                    onClick={handleClose}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
