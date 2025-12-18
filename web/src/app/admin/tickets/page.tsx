'use client';

import { useState, useEffect } from 'react';
import { getAllTickets, replyToTicket, closeTicket } from '@/actions/tickets';
import { MessageCircle, Send, CheckCircle2, User, Clock, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

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
    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setIsLoading(true);
        const data = await getAllTickets();
        setTickets(data as unknown as Ticket[]);
        setIsLoading(false);
    };

    const handleReply = async (ticketId: string) => {
        const text = replyText[ticketId];
        if (!text?.trim()) return;

        setIsSubmitting(prev => ({ ...prev, [ticketId]: true }));
        const result = await replyToTicket(ticketId, text);

        if (result.success) {
            setReplyText(prev => ({ ...prev, [ticketId]: '' }));
            fetchTickets();
        } else {
            alert("Error: " + result.error);
        }
        setIsSubmitting(prev => ({ ...prev, [ticketId]: false }));
    };

    const handleClose = async (ticketId: string) => {
        if (!confirm("Are you sure you want to close this ticket?")) return;

        const result = await closeTicket(ticketId);
        if (result.success) {
            fetchTickets();
        } else {
            alert("Error closing ticket");
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
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage and respond to spiritual inquiries</p>
                </div>
                <div className="flex space-x-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {tickets.filter(t => t.status === 'OPEN').length} New
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {tickets.filter(t => t.status === 'ANSWERED').length} Answered
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {tickets.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">No tickets yet</h3>
                        <p className="text-gray-500">User inquiries will appear here.</p>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div key={ticket.id} className={`bg-white rounded-xl shadow-sm border transition-all ${expandedTicketId === ticket.id ? 'ring-2 ring-ochre border-transparent' : 'border-gray-200'}`}>
                            {/* Ticket Summary Header */}
                            <div
                                onClick={() => setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id)}
                                className="p-6 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-none border border-gray-200">
                                        {ticket.user.image ? (
                                            <img src={ticket.user.image} alt={ticket.user.name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-full h-6 m-3 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-bold text-lg text-gray-900">{ticket.subject}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                    ticket.status === 'ANSWERED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                                            <span className="font-medium text-gray-700">{ticket.user.name || ticket.user.email}</span>
                                            <span>•</span>
                                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{ticket.messages.length} messages</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {expandedTicketId === ticket.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedTicketId === ticket.id && (
                                <div className="border-t border-gray-100 bg-gray-50 rounded-b-xl">
                                    {/* Message Thread */}
                                    <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                                        {ticket.messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.sender === 'USER'
                                                        ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                                        : 'bg-ochre text-white rounded-tr-none'
                                                    }`}>
                                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                                    <div className={`text-[10px] mt-2 font-medium ${msg.sender === 'USER' ? 'text-gray-400' : 'text-orange-100'}`}>
                                                        {new Date(msg.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Area */}
                                    {ticket.status !== 'CLOSED' && (
                                        <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl space-y-4">
                                            <div className="relative">
                                                <textarea
                                                    value={replyText[ticket.id] || ''}
                                                    onChange={(e) => setReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                                                    placeholder="Type your spiritual guidance here..."
                                                    rows={3}
                                                    className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-ochre focus:border-transparent outline-none text-sm resize-none"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() => handleClose(ticket.id)}
                                                    className="text-gray-500 hover:text-red-600 text-sm font-medium flex items-center transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Close Inquiry
                                                </button>
                                                <button
                                                    disabled={isSubmitting[ticket.id] || !replyText[ticket.id]?.trim()}
                                                    onClick={() => handleReply(ticket.id)}
                                                    className="bg-ochre text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50 flex items-center shadow-md active:scale-95"
                                                >
                                                    {isSubmitting[ticket.id] ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4 mr-2" />
                                                    )}
                                                    Send Guidance
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
