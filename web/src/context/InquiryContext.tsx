'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getTickets } from '@/actions/tickets';

interface Message {
    id: string;
    text: string;
    sender: 'USER' | 'ADMIN';
    createdAt: string;
}

interface Ticket {
    id: string;
    subject: string;
    status: 'OPEN' | 'ANSWERED' | 'CLOSED';
    createdAt: string;
    messages: Message[];
}

interface InquiryContextType {
    tickets: Ticket[];
    unreadCount: number;
    refreshTickets: () => Promise<void>;
    isLoading: boolean;
    readMessages: { [key: string]: string };
    markAsRead: (ticketId: string, messageId: string) => void;
    acknowledgedTickets: string[];
    acknowledgeTicket: (ticketId: string) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded, isSignedIn } = useUser();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [readMessages, setReadMessages] = useState<{ [key: string]: string }>({});
    const [acknowledgedTickets, setAcknowledgedTickets] = useState<string[]>([]);

    // Load local state
    useEffect(() => {
        const savedRead = localStorage.getItem('krishnasagar_read_messages');
        if (savedRead) setReadMessages(JSON.parse(savedRead));

        const savedAck = localStorage.getItem('krishnasagar_acknowledged_tickets');
        if (savedAck) setAcknowledgedTickets(JSON.parse(savedAck));
    }, []);

    const fetchTickets = useCallback(async () => {
        if (!isSignedIn) return;

        try {
            const data = await getTickets();
            setTickets(data as Ticket[]);
        } catch (error) {
            console.error('Failed to fetch tickets in context:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchTickets();
            // Optional: poll every minute
            const interval = setInterval(fetchTickets, 60000);
            return () => clearInterval(interval);
        } else if (isLoaded) {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn, fetchTickets]);

    const markAsRead = (ticketId: string, messageId: string) => {
        const next = { ...readMessages, [ticketId]: messageId };
        setReadMessages(next);
        localStorage.setItem('krishnasagar_read_messages', JSON.stringify(next));
    };

    const acknowledgeTicket = (ticketId: string) => {
        if (!acknowledgedTickets.includes(ticketId)) {
            const next = [...acknowledgedTickets, ticketId];
            setAcknowledgedTickets(next);
            localStorage.setItem('krishnasagar_acknowledged_tickets', JSON.stringify(next));
        }
    };

    // Calculate unread count
    const unreadCount = tickets.filter(ticket => {
        if (ticket.messages.length === 0) return false;

        const lastMsg = ticket.messages[ticket.messages.length - 1];
        const isRead = readMessages[ticket.id] === lastMsg.id;

        if (ticket.status === 'ANSWERED') {
            return !isRead;
        }

        if (ticket.status === 'CLOSED') {
            const isAck = acknowledgedTickets.includes(ticket.id);
            return !isRead && !isAck;
        }

        return false;
    }).length;

    // Sync with PWA App Badge API
    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
            if (unreadCount > 0) {
                (navigator as any).setAppBadge(unreadCount).catch((err: any) => {
                    console.error('Failed to set app badge:', err);
                });
            } else {
                (navigator as any).clearAppBadge().catch((err: any) => {
                    console.error('Failed to clear app badge:', err);
                });
            }
        }
    }, [unreadCount]);

    return (
        <InquiryContext.Provider value={{
            tickets,
            unreadCount,
            refreshTickets: fetchTickets,
            isLoading,
            readMessages,
            markAsRead,
            acknowledgedTickets,
            acknowledgeTicket
        }}>
            {children}
        </InquiryContext.Provider>
    );
}

export function useInquiry() {
    const context = useContext(InquiryContext);
    if (context === undefined) {
        throw new Error('useInquiry must be used within an InquiryProvider');
    }
    return context;
}
