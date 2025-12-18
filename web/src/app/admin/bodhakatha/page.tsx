
import Link from 'next/link';
import prisma from '@/lib/db';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminBodhakathaPage() {
    const bodhakathas = await prisma.bodhakatha.findMany({
        orderBy: { orderId: 'asc' }
    });

    return (
        <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 md:pb-6 gap-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Bodhakatha</h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Manage instructional stories and wisdom teachings</p>
                </div>
                <Link
                    href="/admin/bodhakatha/new"
                    className="flex items-center justify-center space-x-2 bg-ochre text-white px-5 py-3 rounded-xl hover:bg-gold transition-all shadow-lg shadow-ochre/20 whitespace-nowrap active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-black text-xs uppercase tracking-widest">Add New Story</span>
                </Link>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Theme</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title (English)</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bodhakathas.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] uppercase font-black text-white bg-ochre px-2 py-0.5 rounded-md">
                                        {item.theme}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{item.title_english}</div>
                                    <div className="text-xs text-gray-400 font-serif italic">{item.title_hindi}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={`/admin/bodhakatha/${item.id}`}
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
            <div className="md:hidden space-y-3">
                {bodhakathas.map((item: any) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase font-black text-white bg-ochre px-2 py-0.5 rounded-md shadow-sm shadow-ochre/10">
                                {item.theme}
                            </span>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/bodhakatha/${item.id}`}
                                    className="p-2 text-blue-500 bg-blue-50 rounded-lg transition-colors border border-blue-100/50"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <button className="p-2 text-red-500 bg-red-50 rounded-lg transition-colors border border-red-100/50">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 leading-tight text-base">{item.title_english}</h3>
                            <p className="text-xs text-gray-400 font-serif italic mt-0.5">{item.title_hindi}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
