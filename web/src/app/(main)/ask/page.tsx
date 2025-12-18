'use client';

import { useState, useEffect } from 'react';
import { MessageCircleQuestion, Send, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { getTickets, createTicket, closeTicket, userReplyToTicket } from '@/actions/tickets';
import { Notification, NotificationType } from '@/components/common/Notification';
import { Modal } from '@/components/common/Modal';

type TicketMessage = {
    sender: 'USER' | 'ADMIN';
    text: string;
    createdAt: Date;
};

type Ticket = {
    id: string;
    subject: string;
    status: 'OPEN' | 'ANSWERED' | 'CLOSED';
    createdAt: Date;
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
    const [followUpSuccess, setFollowUpSuccess] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchTickets();
        } else if (isLoaded) {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn]);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const data = await getTickets();
            const currentData = data as any[];
            setTickets(currentData as unknown as Ticket[]);

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

    const handleCloseTicket = async () => {
        if (!ticketToClose) return;

        const result = await closeTicket(ticketToClose);
        if (result.success) {
            setNotification({ message: "Inquiry closed successfully", type: 'success' });
            fetchTickets();
        } else {
            setNotification({ message: "Error closing inquiry: " + (result as any).error, type: 'error' });
        }
        setTicketToClose(null);
    };

    const toggleExpand = (id: string) => {
        setExpandedTicketId(expandedTicketId === id ? null : id);
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
                setFollowUpSuccess(prev => ({ ...prev, [ticketId]: true }));
                fetchTickets();
                setTimeout(() => {
                    setFollowUpSuccess(prev => ({ ...prev, [ticketId]: false }));
                }, 4000);
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-ochre" />
            </div>
        );
    }

    const filteredTickets = tickets.filter(t =>
        activeTab === 'open' ? (t.status === 'OPEN' || t.status === 'ANSWERED') : (t.status === 'CLOSED')
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 px-4">
            <SignedOut>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-lg mx-auto w-full px-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                        <MessageCircleQuestion className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Spiritual Inquiry</h1>
                    <p className="text-gray-500 text-lg">
                        Sign in to seek personalized spiritual guidance and track your questions effectively.
                    </p>
                    <SignInButton mode="modal">
                        <button className="bg-ochre text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition shadow-lg w-full md:w-auto">
                            Sign In to Begin
                        </button>
                    </SignInButton>
                    <p className="text-xs text-gray-400 mt-4">
                        * This is a secure & private channel.
                    </p>
                </div>
            </SignedOut>

            <SignedIn>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        duration={3000}
                        onClose={() => setNotification(null)}
                    />
                )}
                {/* Header */}
                <div className="flex flex-col space-y-2 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-ochre/10 rounded-xl flex items-center justify-center text-ochre flex-none">
                            <MessageCircleQuestion className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Guidance & Inquiry</h1>
                            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Spiritual Support Channel</p>
                        </div>
                    </div>
                </div>

                {/* Conditional Layout: Swap Ask Form and History based on existence of inquiries */}
                <div className="flex flex-col space-y-8">
                    {tickets.length === 0 ? (
                        <>
                            {/* NEW USER VIEW: Prioritize the Form */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-ochre/5 border border-gray-100 overflow-hidden">
                                <div className="p-8 md:p-12 text-center space-y-6">
                                    <div className="w-20 h-20 bg-ochre/5 rounded-full flex items-center justify-center mx-auto text-ochre">
                                        <Send className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-gray-900">Seek Divine Guidance</h2>
                                        <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
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
                                                <p className="text-gray-500 mt-2 max-w-[250px] mx-auto text-sm">Your request has been sent to Krishnaji.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Topic</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={newTicketSubject}
                                                        onChange={(e) => setNewTicketSubject(e.target.value)}
                                                        placeholder="e.g., Guidance on Meditation Practice"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3 focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none transition-all text-sm font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Question</label>
                                                    <textarea
                                                        required
                                                        rows={5}
                                                        value={newTicketMessage}
                                                        onChange={(e) => setNewTicketMessage(e.target.value)}
                                                        placeholder="Please share your spiritual question or request for guidance in detail..."
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none transition-all text-sm leading-relaxed resize-none font-medium"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-ochre text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-50 flex items-center justify-center shadow-xl shadow-ochre/20 active:scale-[0.98]"
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
                        </>
                    ) : (
                        <>
                            {/* RETURNING USER VIEW: Prioritize History/Guidance */}
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
                                                        <h3 className="font-bold text-gray-900 leading-tight">Request Received</h3>
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
                                            <button
                                                onClick={() => setActiveTab('open')}
                                                className={`flex-1 md:flex-none py-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'open' ? 'bg-white text-ochre shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                Active Guidance
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('closed')}
                                                className={`flex-1 md:flex-none py-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'closed' ? 'bg-white text-ochre shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                Past Records
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
                                                    {/* Ticket Header */}
                                                    <div
                                                        onClick={() => toggleExpand(ticket.id)}
                                                        className={`p-4 md:p-5 flex items-center justify-between cursor-pointer transition-colors ${expandedTicketId === ticket.id ? 'bg-ochre/5' : 'hover:bg-gray-50/80'}`}
                                                    >
                                                        <div className="flex items-center space-x-4 min-w-0">
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
                                                                    <span>•</span>
                                                                    <span>{new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3 ml-2">
                                                            {ticket.status === 'ANSWERED' && (
                                                                <span className="hidden md:block bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
                                                                    Answered
                                                                </span>
                                                            )}
                                                            <div className={`p-1 rounded-full transition-colors ${expandedTicketId === ticket.id ? 'bg-ochre/20 text-ochre' : 'text-gray-300'}`}>
                                                                {expandedTicketId === ticket.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Ticket Body (Expanded) */}
                                                    {expandedTicketId === ticket.id && (
                                                        <div className="bg-gray-50/50 p-4 md:p-6 border-t border-gray-50 space-y-4">
                                                            {ticket.messages.map((msg: any, idx: number) => (
                                                                <div key={idx} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                                                                    <div className={`text-[9px] font-black uppercase tracking-[0.15em] mb-1.5 ${msg.sender === 'USER' ? 'text-gray-400' : 'text-ochre'}`}>
                                                                        {msg.sender === 'USER' ? 'Your Request' : 'Krishnaji Guidance'}
                                                                    </div>
                                                                    <div className={`max-w-[90%] px-4 py-3 shadow-sm relative group w-fit ${msg.sender === 'USER'
                                                                        ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tr-none'
                                                                        : 'bg-ochre text-white rounded-2xl rounded-tl-none font-medium'
                                                                        }`}>
                                                                        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                                        <div className={`text-[10px] mt-2 font-bold opacity-60 flex items-center ${msg.sender === 'USER' ? 'text-gray-400' : 'text-white'}`}>
                                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {ticket.status !== 'CLOSED' && (
                                                                <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
                                                                    {followUpSuccess[ticket.id] ? (
                                                                        <div className="flex items-center space-x-3 py-3 px-4 bg-green-50/50 rounded-xl border border-green-100 animate-in fade-in zoom-in duration-300">
                                                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Guidance shared with Krishnaji</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Send Follow-up</label>
                                                                            <textarea
                                                                                value={followUpText[ticket.id] || ''}
                                                                                onChange={(e) => setFollowUpText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                                                                                placeholder="Type your clarifying question here..."
                                                                                rows={3}
                                                                                className="w-full bg-white border border-gray-100 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-ochre/10 focus:border-ochre outline-none transition-all resize-none font-medium"
                                                                            />
                                                                            <div className="flex justify-between items-center">
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setTicketToClose(ticket.id);
                                                                                    }}
                                                                                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                                                                                >
                                                                                    Close Inquiry
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleFollowUp(ticket.id)}
                                                                                    disabled={isFollowUpSubmitting[ticket.id] || !followUpText[ticket.id]?.trim()}
                                                                                    className="bg-ochre text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-30 shadow-lg shadow-ochre/20 flex items-center active:scale-95"
                                                                                >
                                                                                    {isFollowUpSubmitting[ticket.id] ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Send className="w-3 h-3 mr-2" />}
                                                                                    Send
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SignedIn>

            <Modal
                isOpen={!!ticketToClose}
                onClose={() => setTicketToClose(null)}
                title="Close Inquiry?"
                actions={
                    <>
                        <button
                            onClick={() => setTicketToClose(null)}
                            className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleCloseTicket}
                            className="w-full py-3 rounded-xl bg-red-800 text-white font-bold hover:bg-red-900 transition shadow-md"
                        >
                            Yes, Close
                        </button>
                    </>
                }
            >
                Are you sure you want to close this inquiry? This will move it to your history.
            </Modal>
        </div >
    );
}
