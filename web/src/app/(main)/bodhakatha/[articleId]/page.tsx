import prisma from '@/lib/db';
import ReferenceVideos from '@/components/features/ReferenceVideos';
import ChapterTextViewer from '@/components/features/ChapterTextViewer';

import { Metadata } from 'next';

// Server Component
export async function generateStaticParams() {
    const bodhakathas = await prisma.bodhakatha.findMany({
        select: { id: true }
    });
    return bodhakathas.map((article: { id: string }) => ({
        articleId: article.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ articleId: string }> }): Promise<Metadata> {
    const { articleId } = await params;
    const article = await prisma.bodhakatha.findUnique({
        where: { id: articleId }
    });

    if (!article) return { title: 'Article Not Found' };

    return {
        title: article.title_english,
        description: article.description.substring(0, 160),
        keywords: article.keywords,
        openGraph: {
            title: article.title_english,
            description: article.description.substring(0, 160),
            images: [`https://img.youtube.com/vi/${article.youtube_id}/maxresdefault.jpg`],
        }
    };
}



export default async function BodhakathaDetailPage({ params }: { params: Promise<{ articleId: string }> }) {
    const { articleId } = await params;
    const article = await prisma.bodhakatha.findUnique({
        where: { id: articleId }
    });

    if (!article) {
        return <div>Article not found</div>;
    }

    // Instructional mock text
    const dummyText = article.description;

    const videos = [{
        id: article.id,
        youtube_id: article.youtube_id,
        title: "Teaching Narration",
        description: `Theme: ${article.theme}`
    }];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title_english,
        "alternativeHeadline": article.title_hindi,
        "image": `https://img.youtube.com/vi/${article.youtube_id}/maxresdefault.jpg`,
        "author": {
            "@type": "Person",
            "name": "Krishnaji"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Saileela Rahasya",
            "logo": {
                "@type": "ImageObject",
                "url": "https://saileelarahasya-web.vercel.app/icon-512.png"
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
                "item": "https://saileelarahasya-web.vercel.app"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Bodhakatha",
                "item": "https://saileelarahasya-web.vercel.app/bodhakatha"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title_english,
                "item": `https://saileelarahasya-web.vercel.app/bodhakatha/${articleId}`
            }
        ]
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)] pt-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {/* Left: Text Content (Prominent) - First on mobile and desktop */}
            <div className="w-full lg:w-2/3 flex-1 overflow-y-auto pr-4 custom-scrollbar">

                <article className="prose prose-ochre max-w-none bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-bold text-white bg-ochre px-2 py-1 rounded">
                                {article.theme}
                            </span>
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">{article.title_english}</h1>
                        <h2 className="text-lg md:text-2xl text-ochre font-serif">{article.title_hindi}</h2>
                    </div>

                    <div className="mt-8">
                        <ChapterTextViewer text={dummyText} />
                    </div>

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
