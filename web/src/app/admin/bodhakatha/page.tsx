
import Link from 'next/link';
import prisma from '@/lib/db';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminBodhakathaPage() {
    const bodhakathas = await prisma.bodhakatha.findMany({
        orderBy: { orderId: 'asc' }
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bodhakatha Management</h1>
                    <p className="text-sm text-gray-500">Manage instructional stories and wisdom</p>
                </div>
                <Link
                    href="/admin/bodhakatha/new"
                    className="flex items-center space-x-2 bg-ochre text-white px-5 py-2.5 rounded-xl hover:bg-gold transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-bold text-sm">Add New</span>
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
            <div className="md:hidden space-y-4">
                {bodhakathas.map((item: any) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase font-black text-white bg-ochre px-2 py-0.5 rounded-md">
                                {item.theme}
                            </span>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={`/admin/bodhakatha/${item.id}`}
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
                            <h3 className="font-bold text-gray-900 leading-tight">{item.title_english}</h3>
                            <p className="text-sm text-gray-400 font-serif italic mt-1">{item.title_hindi}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <span className="text-[10px] font-mono text-gray-300">ID: {item.id.substring(0, 8)}...</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
