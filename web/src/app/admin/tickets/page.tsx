'use client';

import { useState, useEffect } from 'react';
import { getAllTickets, replyToTicket, closeTicket, getTicketStats } from '@/actions/tickets';
import { MessageCircle, Send, CheckCircle2, User, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Notification, NotificationType } from '@/components/common/Notification';

type TicketMessage = {
    sender: 'USER' | 'ADMIN';
    text: string;
    createdAt: string;
};

type TicketUser = {
    name: string | null;
    email: string;
    image: string | null;
}

type Ticket = {
    id: string;
    subject: string;
    status: 'OPEN' | 'ANSWERED' | 'CLOSED';
    createdAt: string;
    user: TicketUser;
    messages: TicketMessage[];
};

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [stats, setStats] = useState({ OPEN: 0, ANSWERED: 0, CLOSED: 0 });
    const [filter, setFilter] = useState<'OPEN' | 'ANSWERED' | 'CLOSED' | 'ALL'>('OPEN');

    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});

    // UI Feedback State
    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
    const [confirmCloseId, setConfirmCloseId] = useState<string | null>(null);
    const [postReplyActionId, setPostReplyActionId] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
        fetchTickets(1, true);
        fetchStats();
    }, [filter]);

    const fetchStats = async () => {
        const counts = await getTicketStats();
        setStats(counts);
    };

    const fetchTickets = async (pageNum: number, isReset: boolean = false) => {
        setIsLoading(true);
        try {
            const result = await getAllTickets(pageNum, 20, filter);
            if (isReset) {
                setTickets(result.tickets as unknown as Ticket[]);
            } else {
                setTickets(prev => [...prev, ...(result.tickets as unknown as Ticket[])]);
            }
            setHasMore(result.hasMore);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTickets(nextPage);
    };

    const handleReply = async (ticketId: string) => {
        const text = replyText[ticketId];
        if (!text?.trim()) return;

        setIsSubmitting(prev => ({ ...prev, [ticketId]: true }));
        const result = await replyToTicket(ticketId, text);

        if (result.success) {
            setReplyText(prev => ({ ...prev, [ticketId]: '' }));
            setExpandedTicketId(null);
            setPostReplyActionId(ticketId);
            fetchTickets(1, true);
            fetchStats();
        } else {
            setNotification({ message: result.error || "Error sending guidance", type: 'error' });
        }
        setIsSubmitting(prev => ({ ...prev, [ticketId]: false }));
    };

    const handleClose = async (ticketId: string) => {
        setConfirmCloseId(null);
        const result = await closeTicket(ticketId);
        if (result.success) {
            setNotification({ message: "Inquiry closed successfully", type: 'success' });
            fetchTickets(1, true);
            fetchStats();
        } else {
            setNotification({ message: "Error closing inquiry", type: 'error' });
        }
    };

    if (isLoading && tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-ochre" />
                <p className="text-lg">Loading all inquiries...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Seeker Inquiries</h1>
                    <p className="text-sm md:text-base text-gray-500 font-medium">Manage and respond to spiritual guidance requests</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setFilter('OPEN')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all border ${filter === 'OPEN'
                            ? 'bg-orange-50 text-ochre border-ochre/20 shadow-sm shadow-ochre/10'
                            : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        <span className="flex-none">{stats.OPEN} New</span>
                    </button>
                    <button
                        onClick={() => setFilter('ANSWERED')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all border ${filter === 'ANSWERED'
                            ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100/10'
                            : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        <span className="flex-none">{stats.ANSWERED} Answered</span>
                    </button>
                    <button
                        onClick={() => setFilter('CLOSED')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all border ${filter === 'CLOSED'
                            ? 'bg-gray-100 text-gray-600 border-gray-200'
                            : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        <span className="flex-none">{stats.CLOSED} Closed</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4 w-full mt-6 md:mt-10">
                {tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm animate-in fade-in duration-500 mx-1">
                        <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Nothing here</h3>
                        <p className="text-sm text-gray-400 font-medium">No inquiries matching this status.</p>
                    </div>
                ) : (
                    <>
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => setExpandedTicketId(ticket.id)}
                                className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between gap-3 md:gap-4 cursor-pointer hover:border-ochre/30 hover:shadow-md transition-all active:scale-[0.99] group animate-in slide-in-from-bottom-2 duration-300 w-full overflow-hidden"
                            >
                                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden flex-none border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                                        {ticket.user.image ? (
                                            <img src={ticket.user.image} alt={ticket.user.name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5 md:mb-1">
                                            <h3 className="font-black text-sm md:text-lg text-gray-900 truncate tracking-tight">{ticket.subject}</h3>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] flex-none ${ticket.status === 'OPEN' ? 'bg-orange-100 text-ochre' :
                                                ticket.status === 'ANSWERED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-tight gap-1.5 md:gap-2">
                                            <span className="truncate group-hover:text-gray-600 transition-colors uppercase">{ticket.user.name?.split(' ')[0] || 'Anonymous'}</span>
                                            <span className="opacity-30">•</span>
                                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-none">
                                    <div className="bg-gray-100/50 group-hover:bg-ochre group-hover:text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black text-gray-500 transition-all border border-gray-100/10 uppercase tracking-widest shadow-sm">
                                        {ticket.messages.length} MSG
                                    </div>
                                </div>
                            </div>
                        ))}

                        {hasMore && (
                            <div className="flex justify-center pt-8 pb-12">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        loadMore();
                                    }}
                                    disabled={isLoading}
                                    className="bg-white text-ochre px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-ochre/20 hover:bg-orange-50 transition-all flex items-center shadow-sm disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Explore More"
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Conversation Focused Modal */}
            <Modal
                isOpen={!!expandedTicketId}
                onClose={() => setExpandedTicketId(null)}
                title={tickets.find(t => t.id === expandedTicketId)?.subject || 'Inquiry'}
                flush
            >
                <div className="flex flex-col h-[70vh]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-gray-50/50">
                        {tickets.find(t => t.id === expandedTicketId)?.messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm ${msg.sender === 'USER'
                                    ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                    : 'bg-ochre text-white rounded-tr-none shadow-ochre/20'
                                    }`}>
                                    <p className="text-[13px] font-medium leading-relaxed">{msg.text}</p>
                                    <div className={`text-[8px] mt-1 font-black uppercase tracking-widest ${msg.sender === 'USER' ? 'text-gray-400' : 'text-orange-100/70'
                                        }`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {expandedTicketId && tickets.find(t => t.id === expandedTicketId)?.status !== 'CLOSED' && (
                        <div className="p-4 bg-white border-t border-gray-100 pb-8 md:pb-4">
                            <textarea
                                value={replyText[expandedTicketId] || ''}
                                onChange={(e) => setReplyText(prev => ({ ...prev, [expandedTicketId!]: e.target.value }))}
                                placeholder="Type spiritual guidance..."
                                rows={2}
                                className="w-full border-none bg-gray-50 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-ochre/20 outline-none resize-none mb-3"
                            />
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={() => setConfirmCloseId(expandedTicketId)}
                                    className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-red-500 transition-colors py-2"
                                >
                                    Close Inquiry
                                </button>
                                <button
                                    disabled={isSubmitting[expandedTicketId] || !replyText[expandedTicketId]?.trim()}
                                    onClick={() => handleReply(expandedTicketId!)}
                                    className="bg-ochre text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all disabled:opacity-30 shadow-lg shadow-ochre/20 flex items-center"
                                >
                                    {isSubmitting[expandedTicketId] ? (
                                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="w-3 h-3 mr-2" />
                                    )}
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Post-Reply Action Modal */}
            <Modal
                isOpen={!!postReplyActionId}
                onClose={() => setPostReplyActionId(null)}
                title="Guidance Sent"
                actions={
                    <>
                        <button
                            onClick={() => setPostReplyActionId(null)}
                            className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Keep Open
                        </button>
                        <button
                            onClick={() => {
                                if (postReplyActionId) {
                                    handleClose(postReplyActionId);
                                    setPostReplyActionId(null);
                                }
                            }}
                            className="bg-ochre text-white px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-ochre/20"
                        >
                            Close Inquiry
                        </button>
                    </>
                }
            >
                <div className="text-center py-2">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                        Your spiritual guidance has been shared. Would you like to mark this inquiry as closed?
                    </p>
                </div>
            </Modal>

            <Modal
                isOpen={!!confirmCloseId}
                onClose={() => setConfirmCloseId(null)}
                title="Archive Inquiry?"
                actions={
                    <>
                        <button
                            onClick={() => setConfirmCloseId(null)}
                            className="w-full py-3 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition active:scale-95"
                        >
                            Keep Open
                        </button>
                        <button
                            onClick={() => confirmCloseId && handleClose(confirmCloseId)}
                            className="w-full py-3 rounded-2xl bg-ochre text-white font-black text-[10px] uppercase tracking-widest hover:bg-gold transition shadow-lg shadow-ochre/20 active:scale-95"
                        >
                            Confirm Archive
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-500 leading-relaxed px-1">
                        Are you sure you want to mark this spiritual inquiry as closed? This action will move the conversation to the <span className="text-ochre font-bold lowercase">Past Records</span> archive.
                    </p>
                </div>
            </Modal>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                    duration={3000}
                />
            )}
        </div>
    );
}
