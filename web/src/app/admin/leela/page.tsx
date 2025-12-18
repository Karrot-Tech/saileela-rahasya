
import Link from 'next/link';
import prisma from '@/lib/db';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminLeelaPage() {
    const leelas = await prisma.leela.findMany({
        orderBy: { orderId: 'asc' }
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leela Management</h1>
                    <p className="text-sm text-gray-500">Manage the stories and plays of Sai Baba</p>
                </div>
                <Link
                    href="/admin/leela/new"
                    className="flex items-center space-x-2 bg-ochre text-white px-5 py-2.5 rounded-xl hover:bg-gold transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-bold text-sm">Add New Leela</span>
                </Link>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title (English)</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Chapter</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leelas.map((leela: any) => (
                            <tr key={leela.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{leela.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{leela.title_english}</div>
                                    <div className="text-xs text-gray-400 font-serif italic">{leela.title_hindi}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 italic">
                                        {leela.chapter || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={`/admin/leela/${leela.id}`}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors shadow-sm bg-white border border-gray-100"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm bg-white border border-gray-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {leelas.map((leela: any) => (
                    <div key={leela.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="bg-ochre/5 text-ochre text-[10px] font-black uppercase px-2 py-1 rounded-md border border-ochre/10">
                                Chapter {leela.chapter || 'N/A'}
                            </span>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={`/admin/leela/${leela.id}`}
                                    className="p-2 text-blue-500 bg-gray-50 rounded-lg shadow-inner"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <button className="p-2 text-red-500 bg-gray-50 rounded-lg shadow-inner">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{leela.title_english}</h3>
                            <p className="text-sm text-gray-400 font-serif italic mt-1">{leela.title_hindi}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <span className="text-[10px] font-mono text-gray-300">ID: {leela.id.substring(0, 8)}...</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
