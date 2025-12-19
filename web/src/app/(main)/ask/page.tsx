'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircleQuestion, Send, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { getTickets, createTicket, closeTicket, userReplyToTicket } from '@/actions/tickets';
import { Notification, NotificationType } from '@/components/common/Notification';
import { Modal } from '@/components/common/Modal';

type TicketMessage = {
    id: string;
    sender: 'USER' | 'ADMIN';
    text: string;
    createdAt: string;
};

type Ticket = {
    id: string;
    subject: string;
    status: 'OPEN' | 'ANSWERED' | 'CLOSED';
    createdAt: string;
    messages: TicketMessage[];
};

export default function AskPage() {
    const { isLoaded, isSignedIn } = useUser();
    const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
    const [isNewQuestionExpanded, setIsNewQuestionExpanded] = useState(false);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketMessage, setNewTicketMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
    const [ticketToClose, setTicketToClose] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
    const [followUpText, setFollowUpText] = useState<{ [key: string]: string }>({});
    const [isFollowUpSubmitting, setIsFollowUpSubmitting] = useState<{ [key: string]: boolean }>({});

    const [archiveSuccess, setArchiveSuccess] = useState(false);
    const [lastSentMessageId, setLastSentMessageId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [tickets, expandedTicketId]);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const data = await getTickets();
            const currentData = data as unknown as Ticket[];
            setTickets(currentData);

            const hasAnyTickets = currentData.length > 0;
            if (!hasAnyTickets) {
                setIsNewQuestionExpanded(true);
            } else {
                setIsNewQuestionExpanded(false);
            }
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        }
        setIsLoading(false);
        setHasInitialLoaded(true);
    };

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchTickets();
        } else if (isLoaded) {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn]);

    const handleCloseTicket = async () => {
        if (!ticketToClose) return;

        const result = await closeTicket(ticketToClose);
        if (result.success) {
            setArchiveSuccess(true);
            fetchTickets();
            setTimeout(() => setArchiveSuccess(false), 4000);
            setExpandedTicketId(null); // Close the chat modal if it was open
        } else {
            setNotification({ message: "Error closing inquiry: " + (result.error || "Unknown error"), type: 'error' });
        }
        setTicketToClose(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await createTicket(newTicketSubject, newTicketMessage);

            if (result.success) {
                setNewTicketSubject('');
                setNewTicketMessage('');
                fetchTickets();
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    setIsNewQuestionExpanded(false);
                }, 4000);
            } else {
                setNotification({ message: "Error: " + result.error, type: 'error' });
            }
        } catch (err) {
            console.error('Error submitting ticket:', err);
            setNotification({ message: "An unexpected error occurred.", type: 'error' });
        }
        setIsSubmitting(false);
    };

    const handleFollowUp = async (ticketId: string) => {
        const text = followUpText[ticketId];
        if (!text?.trim()) return;

        setIsFollowUpSubmitting(prev => ({ ...prev, [ticketId]: true }));
        try {
            const result = await userReplyToTicket(ticketId, text);
            if (result.success) {
                setFollowUpText(prev => ({ ...prev, [ticketId]: '' }));
                if (result.message?.id) {
                    setLastSentMessageId(result.message.id);
                    setTimeout(() => setLastSentMessageId(null), 3000);
                }
                fetchTickets();
            } else {
                setNotification({ message: "Error: " + result.error, type: 'error' });
            }
        } catch (err) {
            console.error('Error sending follow-up:', err);
            setNotification({ message: "An unexpected error occurred.", type: 'error' });
        }
        setIsFollowUpSubmitting(prev => ({ ...prev, [ticketId]: false }));
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-ochre" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Initializing...</p>
                </div>
            </div>
        );
    }

    const filteredTickets = tickets.filter(t =>
        activeTab === 'open' ? (t.status === 'OPEN' || t.status === 'ANSWERED') : (t.status === 'CLOSED')
    );

    return (
        <div className="max-w-4xl mx-auto space-y-4 pt-4 px-4 pb-20 md:pb-10">
            {!isSignedIn ? (
                /* GUEST VIEW */
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-lg mx-auto w-full px-4 animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-ochre/5 rounded-full flex items-center justify-center text-ochre/30 mb-2 border border-ochre/5 shadow-inner">
                        <MessageCircleQuestion className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Spiritual Inquiry</h1>
                        <p className="text-gray-500 text-base leading-relaxed font-medium">
                            Please sign in to share your spiritual questions and receive personal guidance from Krishnaji.
                        </p>
                    </div>
                    <SignInButton mode="modal">
                        <button className="bg-ochre text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gold transition-all shadow-xl shadow-ochre/20 w-full md:w-auto active:scale-95">
                            Sign In to Begin
                        </button>
                    </SignInButton>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        * This is a secure & private channel.
                    </p>
                </div>
            ) : (
                /* SIGNED IN VIEW */
                <>
                    {notification && (
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            duration={3000}
                            onClose={() => setNotification(null)}
                        />
                    )}
                    {/* Header */}
                    <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                        <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center text-ochre flex-none">
                            <MessageCircleQuestion className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-ochre">Guidance & Inquiry</h1>
                            <p className="text-sm text-gray-500 font-serif italic">&quot;Spiritual support channel&quot;</p>
                        </div>
                    </div>

                    {!hasInitialLoaded ? (
                        /* LOADING STATE - Prevents Layout Jump */
                        <div className="flex flex-col items-center justify-center py-32 text-gray-300">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-ochre/20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Records...</p>
                        </div>
                    ) : (
                        /* CONTENT - Switch between New User and Returning User */
                        <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
                            {tickets.length === 0 ? (
                                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-ochre/5 border border-gray-100 overflow-hidden">
                                    <div className="p-6 md:p-10 text-center space-y-4">
                                        <div className="w-12 h-12 bg-ochre/5 rounded-2xl flex items-center justify-center mx-auto text-ochre shadow-inner">
                                            <Send className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-black text-gray-900">Seek Divine Guidance</h2>
                                            <p className="text-gray-400 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                                                Share your spiritual query or request personal guidance from Krishnaji.
                                            </p>
                                        </div>

                                        <div className="pt-4 text-left">
                                            {isSuccess ? (
                                                <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
                                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm border border-green-100">
                                                        <CheckCircle2 className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900">Success!</h3>
                                                    <p className="text-gray-500 mt-2 max-w-[250px] mx-auto text-sm">Your inquiry has been shared with Krishnaji.</p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Topic</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={newTicketSubject}
                                                            onChange={(e) => setNewTicketSubject(e.target.value)}
                                                            placeholder="e.g., Guidance on Meditation Practice"
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-2.5 focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none transition-all text-sm font-medium"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Question</label>
                                                        <textarea
                                                            required
                                                            rows={4}
                                                            value={newTicketMessage}
                                                            onChange={(e) => setNewTicketMessage(e.target.value)}
                                                            placeholder="Please share your spiritual question or request for guidance in detail..."
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3.5 focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none transition-all text-sm leading-relaxed resize-none font-medium"
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="w-full bg-ochre text-white py-3.5 rounded-2xl font-black uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-50 flex items-center justify-center shadow-xl shadow-ochre/20 active:scale-[0.98]"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            'Seek Guidance'
                                                        )}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Compact Ask Button (Collapsible) */}
                                    <div className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isNewQuestionExpanded ? 'ring-2 ring-ochre/10' : ''}`}>
                                        <div
                                            onClick={() => setIsNewQuestionExpanded(!isNewQuestionExpanded)}
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isNewQuestionExpanded ? 'bg-ochre text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-ochre/10 group-hover:text-ochre'}`}>
                                                    <Send className="w-4 h-4" />
                                                </div>
                                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Seek NEW Guidance</h2>
                                            </div>
                                            {isNewQuestionExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>

                                        {isNewQuestionExpanded && (
                                            <div className="p-4 border-t border-gray-50 bg-gray-50/30 animate-in slide-in-from-top-2 duration-300">
                                                {isSuccess ? (
                                                    <div className="flex items-center space-x-4 py-8 px-4 bg-white rounded-2xl shadow-sm border border-green-50 animate-in zoom-in duration-500">
                                                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-none">
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 leading-tight">Inquiry Received</h3>
                                                            <p className="text-xs text-gray-500 mt-0.5">Krishnaji will respond to your query soon.</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleSubmit} className="space-y-4">
                                                        <input
                                                            type="text"
                                                            required
                                                            value={newTicketSubject}
                                                            onChange={(e) => setNewTicketSubject(e.target.value)}
                                                            placeholder="Topic of Spiritual Inquiry..."
                                                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none font-medium"
                                                        />
                                                        <textarea
                                                            required
                                                            rows={3}
                                                            value={newTicketMessage}
                                                            onChange={(e) => setNewTicketMessage(e.target.value)}
                                                            placeholder="Please share your spiritual question or request for guidance here..."
                                                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none resize-none font-medium"
                                                        />
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="submit"
                                                                disabled={isSubmitting}
                                                                className="bg-ochre text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-50 flex items-center shadow-lg shadow-ochre/20 active:scale-95"
                                                            >
                                                                {isSubmitting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : 'Submit Inquiry'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Guidance History Sections */}
                                    <div className="space-y-4">
                                        {archiveSuccess && (
                                            <div className="flex items-center space-x-4 py-4 px-5 bg-white rounded-2xl shadow-sm border border-green-50 animate-in slide-in-from-top-2 duration-500 mb-2">
                                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-none border border-green-100/50 shadow-inner">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm leading-tight uppercase tracking-tight">Inquiry Archived</h3>
                                                    <p className="text-[10px] text-gray-500 mt-0.5 font-bold uppercase tracking-widest opacity-60">Successfully moved to Archives</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
                                                <button
                                                    onClick={() => setActiveTab('open')}
                                                    className={`flex-1 md:flex-none py-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'open' ? 'bg-white text-ochre shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    Ongoing
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('closed')}
                                                    className={`flex-1 md:flex-none py-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'closed' ? 'bg-white text-ochre shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    Archived
                                                </button>
                                            </div>
                                        </div>

                                        {isLoading ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                                <Loader2 className="w-10 h-10 animate-spin mb-4 text-ochre/30" />
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Syncing with server...</p>
                                            </div>
                                        ) : filteredTickets.length === 0 ? (
                                            <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                                    <MessageCircleQuestion className="w-6 h-6 text-gray-200" />
                                                </div>
                                                <p className="text-gray-400 text-sm font-medium">No inquiries found in this category.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {filteredTickets.map((ticket: Ticket) => (
                                                    <div key={ticket.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                                        <div
                                                            onClick={() => setExpandedTicketId(ticket.id)}
                                                            className={`p-4 md:p-5 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50/80 active:scale-[0.99] group`}
                                                        >
                                                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none border transition-all ${ticket.status === 'ANSWERED'
                                                                    ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-500/20'
                                                                    : ticket.status === 'OPEN'
                                                                        ? 'bg-green-50 text-green-600 border-green-100'
                                                                        : 'bg-gray-50 text-gray-400 border-gray-100'
                                                                    }`}>
                                                                    <MessageCircleQuestion className={`w-5 h-5 ${ticket.status === 'OPEN' && 'animate-pulse'}`} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h3 className={`font-black text-sm md:text-base leading-tight truncate ${ticket.status === 'ANSWERED' ? 'text-blue-900' : 'text-gray-900'}`}>{ticket.subject}</h3>
                                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center space-x-2">
                                                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[8px]">#{ticket.id.slice(-6)}</span>
                                                                        <span className="opacity-30">•</span>
                                                                        <span>{new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3 ml-2 flex-none">
                                                                {ticket.status === 'ANSWERED' && (
                                                                    <span className="hidden md:block bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
                                                                        Answered
                                                                    </span>
                                                                )}
                                                                <div className="bg-gray-50 group-hover:bg-ochre group-hover:text-white px-2 py-1 rounded-lg text-[8px] font-black text-gray-400 transition-all border border-gray-100 uppercase tracking-widest">
                                                                    {ticket.messages.length} <span className="hidden xs:inline">MSG</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Conversation Focused Modal */}
            <Modal
                isOpen={!!expandedTicketId}
                onClose={() => setExpandedTicketId(null)}
                title={tickets.find(t => t.id === expandedTicketId)?.subject || 'Spiritual Inquiry'}
                flush
            >
                {expandedTicketId && (
                    <div className="flex flex-col h-[70vh]">
                        {/* Thread Content */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar bg-gray-50/50 scroll-smooth"
                        >
                            {tickets.find(t => t.id === expandedTicketId)?.messages.map((msg: TicketMessage, idx: number) => (
                                <div key={msg.id || idx} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                                    <div className={`text-[8px] font-black uppercase tracking-[0.15em] mb-1.5 ${msg.sender === 'USER' ? 'text-gray-400' : 'text-ochre'}`}>
                                        {msg.sender === 'USER' ? 'Your Request' : 'Krishnaji Guidance'}
                                    </div>
                                    <div className={`max-w-[85%] px-4 py-3 shadow-sm relative group w-fit ${msg.sender === 'USER'
                                        ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tr-none'
                                        : 'bg-ochre text-white rounded-2xl rounded-tl-none font-medium shadow-ochre/20'
                                        }`}>
                                        <p className="text-[14px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        <div className={`text-[10px] mt-2 font-bold opacity-60 flex items-center justify-between gap-4 ${msg.sender === 'USER' ? 'text-gray-400' : 'text-white'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {msg.id === lastSentMessageId && (
                                        <div className="flex items-center space-x-1.5 mt-2 transition-all animate-in fade-in slide-in-from-right-4 duration-1000">
                                            <div className="flex items-center space-x-0.5 opacity-40">
                                                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-0" />
                                                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-150" />
                                                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-300" />
                                            </div>
                                            <span className="text-[8px] font-black text-blue-500/80 uppercase tracking-[0.25em]">Guidance Shared</span>
                                            <div className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100/50">
                                                <CheckCircle2 className="w-2.5 h-2.5 text-blue-500" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {tickets.find(t => t.id === expandedTicketId)?.status !== 'CLOSED' && (
                            <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                                <textarea
                                    value={followUpText[expandedTicketId] || ''}
                                    onChange={(e) => setFollowUpText(prev => ({ ...prev, [expandedTicketId!]: e.target.value }))}
                                    placeholder="Type your clarifying question here..."
                                    rows={2}
                                    className="w-full border-none bg-gray-50 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-ochre/20 outline-none resize-none mb-3"
                                />
                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => setTicketToClose(expandedTicketId)}
                                        className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-red-500 transition-colors py-2"
                                    >
                                        Close Inquiry
                                    </button>
                                    <button
                                        disabled={isFollowUpSubmitting[expandedTicketId] || !followUpText[expandedTicketId]?.trim()}
                                        onClick={() => handleFollowUp(expandedTicketId!)}
                                        className="bg-ochre text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-30 shadow-lg shadow-ochre/20 flex items-center active:scale-95"
                                    >
                                        {isFollowUpSubmitting[expandedTicketId] ? (
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
                )}
            </Modal>

            {/* Archive Confirmation Modal */}
            <Modal
                isOpen={!!ticketToClose}
                onClose={() => setTicketToClose(null)}
                title="Archive Inquiry?"
                actions={
                    <>
                        <button
                            onClick={() => setTicketToClose(null)}
                            className="w-full py-3 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition active:scale-95"
                        >
                            Stay Open
                        </button>
                        <button
                            onClick={handleCloseTicket}
                            className="w-full py-3 rounded-2xl bg-ochre text-white font-black text-[10px] uppercase tracking-widest hover:bg-gold transition shadow-lg shadow-ochre/20 active:scale-95"
                        >
                            Yes, Archive
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-500 leading-relaxed px-1">
                        Are you sure you want to mark this spiritual inquiry as closed? It will be moved to your <span className="text-ochre font-bold lowercase">Archives</span> for future reference.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
