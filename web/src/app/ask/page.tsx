'use client';

import { useState, useEffect } from 'react';
import { MessageCircleQuestion, Send, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { getTickets, createTicket, closeTicket } from '@/actions/tickets';
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
    const [isNewQuestionExpanded, setIsNewQuestionExpanded] = useState(true);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketMessage, setNewTicketMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
    const [ticketToClose, setTicketToClose] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

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

            const hasActiveTickets = currentData.some((t: any) => t.status === 'OPEN' || t.status === 'ANSWERED');
            if (window.innerWidth < 768 && hasActiveTickets) {
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
                setNotification({ message: "Guidance Request Submitted!", type: 'success' });
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    setIsNewQuestionExpanded(false);
                }, 3000);
            } else {
                setNotification({ message: "Error: " + result.error, type: 'error' });
            }
        } catch (err) {
            console.error('Error submitting ticket:', err);
            setNotification({ message: "An unexpected error occurred.", type: 'error' });
        }
        setIsSubmitting(false);
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
                    <h1 className="text-3xl font-bold text-gray-800">Ask Krishnaji</h1>
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
                        onClose={() => setNotification(null)}
                    />
                )}
                {/* Header */}
                <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-none">
                        <MessageCircleQuestion className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Spiritual Inquiries</h1>
                        <p className="text-sm text-gray-500 font-serif italic">"Ask and it shall be given"</p>
                    </div>
                </div>

                {/* New Ticket Form */}
                <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${hasInitialLoaded ? 'transition-all duration-500 ease-in-out' : ''} ${isNewQuestionExpanded ? 'max-h-[1000px]' : 'max-h-[72px]'}`}>
                    <div
                        onClick={() => setIsNewQuestionExpanded(!isNewQuestionExpanded)}
                        className="p-6 bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                            <Send className="w-5 h-5 mr-2 text-ochre" />
                            Ask a New Question
                        </h2>
                        {isNewQuestionExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                    </div>

                    <div className={`transition-opacity duration-300 ${isNewQuestionExpanded ? 'opacity-100' : 'opacity-0 invisible'}`}>
                        <div className="p-6 border-t border-gray-50">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm border border-green-100">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Inquiry Received!</h3>
                                    <p className="text-gray-500 mt-2 max-w-[250px] mx-auto text-sm">Krishnaji will provide guidance soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* ... existing form content ... */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Topic</label>
                                        <input
                                            type="text"
                                            required
                                            value={newTicketSubject}
                                            onChange={(e) => setNewTicketSubject(e.target.value)}
                                            placeholder="e.g., Guidance on Meditation"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-ochre focus:border-ochre outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Question</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={newTicketMessage}
                                            onChange={(e) => setNewTicketMessage(e.target.value)}
                                            placeholder="Describe your query in detail..."
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-ochre focus:border-ochre outline-none"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-ochre text-white px-6 py-2 rounded-md font-bold hover:bg-orange-700 transition disabled:opacity-50 flex items-center shadow-md active:scale-95"
                                        >
                                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            {isSubmitting ? 'Seeking...' : 'Seek Guidance'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ticket History */}
                <div className="space-y-4">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('open')}
                            className={`py-2 px-4 font-medium text-sm transition-all ${activeTab === 'open' ? 'text-ochre border-b-2 border-ochre' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Open Inquiries
                        </button>
                        <button
                            onClick={() => setActiveTab('closed')}
                            className={`py-2 px-4 font-medium text-sm transition-all ${activeTab === 'closed' ? 'text-ochre border-b-2 border-ochre' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Past Inquiries
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-ochre" />
                            <p>Loading your inquiries...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <MessageCircleQuestion className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            No inquiries found in this category.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTickets.map((ticket: Ticket) => (
                                <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
                                    {/* Ticket Header */}
                                    <div
                                        onClick={() => toggleExpand(ticket.id)}
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-2 h-2 rounded-full ${ticket.status === 'OPEN' ? 'bg-green-500 animate-pulse' :
                                                ticket.status === 'ANSWERED' ? 'bg-blue-500' : 'bg-gray-400'
                                                }`} />
                                            <div>
                                                <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
                                                <div className="text-xs text-gray-500 flex space-x-2">
                                                    <span className="font-mono">#{ticket.id.slice(-8)}</span>
                                                    <span>•</span>
                                                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                ticket.status === 'ANSWERED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                            {expandedTicketId === ticket.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </div>
                                    </div>

                                    {/* Ticket Body (Expanded) */}
                                    {expandedTicketId === ticket.id && (
                                        <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-3">
                                            {ticket.messages.map((msg: any, idx: number) => (
                                                <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] px-4 py-2.5 shadow-sm relative group w-fit ${msg.sender === 'USER'
                                                        ? 'bg-ochre text-white rounded-[20px] rounded-tr-[4px]'
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-[20px] rounded-tl-[4px]'
                                                        }`}>
                                                        <p className="text-[15px] leading-snug whitespace-pre-wrap">{msg.text}</p>
                                                        <div className={`text-[9px] mt-1 font-medium flex items-center ${msg.sender === 'USER' ? 'text-orange-100/80 justify-end' : 'text-gray-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {ticket.status !== 'CLOSED' && (
                                                <div className="flex justify-center pt-2 border-t border-gray-200 mt-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTicketToClose(ticket.id);
                                                        }}
                                                        className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors py-2 px-6 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-bold active:scale-95"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Close this inquiry</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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
        </div>
    );
}
