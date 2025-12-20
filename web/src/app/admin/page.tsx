
import Link from 'next/link';
import prisma from '@/lib/db';
import { Footprints, Lightbulb, Book, Ticket, Activity, MessageSquare } from 'lucide-react';

export default async function AdminDashboard() {
    // Fetch stats for the dashboard
    const [leelaCount, bodhakathaCount, glossaryCount, ticketCount, openTickets] = await Promise.all([
        prisma.leela.count(),
        prisma.bodhakatha.count(),
        prisma.glossary.count(),
        prisma.ticket.count(),
        prisma.ticket.count({ where: { status: 'OPEN' } })
    ]);

    const stats = [
        { label: 'Content', value: leelaCount + bodhakathaCount + glossaryCount, icon: Activity, color: 'text-blue-600', href: '/admin/leela' },
        { label: 'Inquiries', value: ticketCount, icon: MessageSquare, color: 'text-purple-600', href: '/admin/tickets' },
        { label: 'Pending', value: openTickets, icon: Ticket, color: 'text-orange-600', href: '/admin/tickets' },
    ];

    const panels = [
        {
            title: 'Leela',
            count: leelaCount,
            description: 'Add, edit or delete stories of Sai Baba\'s divine plays.',
            href: '/admin/leela',
            icon: Footprints,
            color: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'hover:border-blue-200'
        },
        {
            title: 'Bodhakatha',
            count: bodhakathaCount,
            description: 'Manage instructional stories and wisdom teachings.',
            href: '/admin/bodhakatha',
            icon: Lightbulb,
            color: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            borderColor: 'hover:border-yellow-200'
        },
        {
            title: 'Glossary',
            count: glossaryCount,
            description: 'Maintain the archive of spiritual terms and definitions.',
            href: '/admin/glossary',
            icon: Book,
            color: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'hover:border-green-200'
        },
        {
            title: 'Seeker Inquiries',
            count: ticketCount,
            description: 'Manage and respond to devotee inquiries and support.',
            href: '/admin/tickets',
            icon: Ticket,
            color: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'hover:border-purple-200'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-12">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:pb-2">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">Admin Console</h1>
                    <p className="text-xs md:text-lg text-gray-500 font-serif italic opacity-70">"Service to humanity is service to God"</p>
                </div>

                {/* Ultra-Responsive Stats Grid */}
                <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                    {stats.map((stat: any, i: number) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className="bg-white p-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-2 md:space-x-3 hover:shadow-md hover:border-gray-200 transition-all active:scale-95 group relative"
                        >
                            <div className="relative">
                                <stat.icon className={`w-3.5 h-3.5 md:w-5 md:h-5 ${stat.color} flex-none transition-transform group-hover:scale-110`} />
                                {stat.label === 'Pending' && stat.value > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-600 text-[6px] md:text-[9px] font-black text-white shadow-lg shadow-red-500/40 ring-2 ring-white animate-in zoom-in duration-300">
                                        {stat.value}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[7px] md:text-[10px] uppercase tracking-tighter text-gray-400 font-black leading-none mb-0.5 truncate">{stat.label}</p>
                                <p className="text-sm md:text-lg font-black text-gray-800 leading-none tracking-tight">{stat.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                {panels.map((panel: any) => (
                    <Link
                        key={panel.href}
                        href={panel.href}
                        className={`group relative overflow-hidden block p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${panel.borderColor}`}
                    >
                        <div className="flex items-center gap-4 md:block">
                            <div className={`w-10 h-10 md:w-14 md:h-14 ${panel.color} ${panel.iconColor} rounded-xl md:rounded-2xl flex items-center justify-center md:mb-6 flex-none group-hover:scale-110 transition-transform duration-500`}>
                                <panel.icon className="w-5 h-5 md:w-7 md:h-7" />
                            </div>

                            <div className="flex-1 min-w-0 md:space-y-2 relative z-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-base md:text-xl font-bold text-gray-800 truncate">{panel.title}</h2>
                                    <span className="text-[10px] md:text-xs font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-ochre group-hover:text-white transition-colors flex-none ml-2">
                                        {panel.count}
                                    </span>
                                </div>
                                <p className="hidden md:block text-xs md:text-sm text-gray-500 leading-relaxed font-serif">
                                    {panel.description}
                                </p>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-full opacity-50 md:group-hover:scale-150 transition-transform duration-700" />
                    </Link>
                ))}
            </div>

        </div>
    );
}
