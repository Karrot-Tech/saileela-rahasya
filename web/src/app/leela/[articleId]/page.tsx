import leelaArticles from '@/data/leela_articles.json';
import ReferenceVideos from '@/components/features/ReferenceVideos';
import ChapterTextViewer from '@/components/features/ChapterTextViewer';

// Server Component
export async function generateStaticParams() {
    return leelaArticles.map((article) => ({
        articleId: article.id.toString(),
    }));
}

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function LeelaDetailPage({ params }: { params: Promise<{ articleId: string }> }) {
    const { articleId } = await params;
    const article = leelaArticles.find((c) => c.id.toString() === articleId);

    if (!article) {
        return <div>Article not found</div>;
    }

    // Reuse the mock text logic
    const dummyText = Array(15).fill(
        "In this beautiful Leela, we see how Sai Baba's method of teaching was unique. He did not give long discourses but taught through example. 'Shraddha' and 'Saburi' were his two coins of Dakshina."
    ).join("\n\n");

    const videos = [{
        id: article.id,
        youtube_id: article.youtube_id,
        title: "Leela Narration",
        description: article.description
    }];

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)] pt-6">
            {/* Left: Text Content (Prominent) - First on mobile and desktop */}
            <div className="w-full lg:w-2/3 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="mb-4">
                    <Link href="/leela" className="inline-flex items-center transition-colors px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 font-medium shadow-sm hover:bg-gray-50 lg:bg-transparent lg:border-0 lg:shadow-none lg:p-0 lg:text-gray-500 lg:hover:text-ochre lg:hover:bg-transparent text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2 lg:mr-1" />
                        Back to Leelas
                    </Link>
                </div>
                <article className="prose prose-ochre max-w-none bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{article.title_english}</h1>
                        <h2 className="text-2xl text-ochre font-serif">{article.title_hindi}</h2>
                    </div>

                    <h3 className="text-lg font-bold text-gray-500 mb-4">{article.chapter} Narrative</h3>
                    <ChapterTextViewer text={dummyText} />

                    {/* Mobile Only: Reference Videos inside card */}
                    <div className="lg:hidden mt-8 pt-6 border-t border-gray-100">
                        <ReferenceVideos videos={videos} />
                    </div>
                </article>
            </div>

            {/* Right: Reference Videos (Secondary) - Desktop Only Sidebar */}
            <div className="hidden lg:block w-full lg:w-1/3 flex-none custom-scrollbar">
                <ReferenceVideos videos={videos} />
            </div>
        </div>
    );
}
