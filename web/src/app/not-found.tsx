'use client';

import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function NotFound() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-4xl font-black text-ochre mb-4">404</h2>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                    The spiritual path you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-ochre text-white rounded-xl font-bold uppercase tracking-wider hover:bg-orange-700 transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </Layout>
    );
}
