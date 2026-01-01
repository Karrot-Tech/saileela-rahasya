import prisma from '@/lib/db';
import ReferenceVideos from '@/components/features/ReferenceVideos';
import ChapterTextViewer from '@/components/features/ChapterTextViewer';

import { Metadata } from 'next';

// Server Component
export async function generateStaticParams() {
    const leelas = await prisma.leela.findMany({
        select: { id: true }
    });
    return leelas.map((article: { id: string }) => ({
        articleId: article.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ articleId: string }> }): Promise<Metadata> {
    const { articleId } = await params;
    const article = await prisma.leela.findUnique({
        where: { id: articleId }
    });

    if (!article) return { title: 'Article Not Found' };

    // Combine keywords and social tags
    const allKeywords = [
        ...(article.keywords || []),
        ...(article.social_tags || [])
    ];

    return {
        title: article.title_english,
        description: article.description.substring(0, 160),
        keywords: allKeywords,
        openGraph: {
            title: article.title_english,
            description: article.description.substring(0, 160),
            images: [`https://img.youtube.com/vi/${article.youtube_id}/maxresdefault.jpg`],
            type: 'article',
            tags: article.social_tags || [],
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
            authors: ['Saileela Rahasya Team'],
        }
    };
}



export default async function LeelaDetailPage({ params }: { params: Promise<{ articleId: string }> }) {
    const { articleId } = await params;
    const article = await prisma.leela.findUnique({
        where: { id: articleId }
    });

    if (!article) {
        return <div>Article not found</div>;
    }

    // Reuse the mock text logic
    const dummyText = article.description;

    const videos = [{
        id: article.id,
        youtube_id: article.youtube_id,
        title: "Leela Narration",
        description: article.description
    }];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title_english,
        "alternativeHeadline": article.title_hindi,
        "image": `https://img.youtube.com/vi/${article.youtube_id}/maxresdefault.jpg`,
        "author": {
            "@type": "Person",
            "name": "Saileela Rahasya Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Saileela Rahasya",
            "logo": {
                "@type": "ImageObject",
                "url": "https://saileelarahasya.com/icon-512.png"
            }
        },
        "description": article.description.substring(0, 160)
    };

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://saileelarahasya.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Leela",
                "item": "https://saileelarahasya.com/leela"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title_english,
                "item": `https://saileelarahasya.com/leela/${articleId}`
            }
        ]
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-8rem)] pt-2 md:pt-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {/* Left: Text Content (Prominent) - First on mobile and desktop */}
            <div className="w-full lg:w-2/3 flex-1 lg:overflow-y-auto lg:pr-4 custom-scrollbar">

                <article className="prose prose-ochre max-w-none bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">{article.title_english}</h1>
                    </div>

                    <div className="space-y-12">
                        {/* The Story */}
                        {article.story && (
                            <section>
                                <h2 className="text-2xl font-serif text-ochre mb-4">The Leela</h2>
                                <ChapterTextViewer text={article.story} />
                            </section>
                        )}

                        {/* The Doubt */}
                        {article.doubt && (
                            <section className="bg-orange-50/50 p-6 rounded-xl border-l-4 border-orange-200">
                                <h2 className="text-xl font-serif text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">?</span> The Conflict / Doubt
                                </h2>
                                <ChapterTextViewer text={article.doubt} />
                            </section>
                        )}

                        {/* The Revelation */}
                        {article.revelation && (
                            <section>
                                <h2 className="text-2xl font-serif text-ochre mb-4">The Revelation</h2>
                                <div className="prose-h4:text-lg prose-h4:font-semibold prose-h4:text-gray-800 prose-ul:list-disc prose-li:my-1">
                                    <ChapterTextViewer text={article.revelation} />
                                </div>
                            </section>
                        )}

                        {/* Scriptural References */}
                        {article.scriptural_refs && (
                            <section className="bg-gray-50 p-6 rounded-xl text-sm text-gray-600">
                                <h3 className="font-semibold text-gray-900 mb-2 uppercase tracking-wide">Scriptural References</h3>
                                <ChapterTextViewer text={article.scriptural_refs} />
                            </section>
                        )}

                        {/* Transcript (Collapsible) */}
                        {article.transcript && (
                            <details className="group mt-8">
                                <summary className="cursor-pointer list-none flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📜</span>
                                        <span className="font-semibold text-gray-700">View Original Transcript</span>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {article.transcript}
                                </div>
                            </details>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 lg:hidden">
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
