
import Link from 'next/link';
import prisma from '@/lib/db';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminGlossaryPage() {
    const glossaryItems = await prisma.glossary.findMany({
        orderBy: { term: 'asc' }
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Glossary Management</h1>
                    <p className="text-sm text-gray-500">Manage terms and definitions</p>
                </div>
                <Link
                    href="/admin/glossary/new"
                    className="flex items-center space-x-2 bg-ochre text-white px-5 py-2.5 rounded-xl hover:bg-gold transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-bold text-sm">Add New Term</span>
                </Link>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Term</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {glossaryItems.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-ochre">{item.term}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link
                                            href={`/admin/glossary/${item.id}`}
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
            <div className="md:hidden grid grid-cols-1 gap-4">
                {glossaryItems.map((item: any) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-lg text-ochre tracking-tight">{item.term}</h3>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={`/admin/glossary/${item.id}`}
                                    className="p-2 text-blue-500 bg-gray-50 rounded-lg"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <button className="p-2 text-red-500 bg-gray-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
