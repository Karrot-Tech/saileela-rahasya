import { MetadataRoute } from 'next';
import leelaArticles from '@/data/leela_articles.json';
import bodhakathaArticles from '@/data/bodhakatha_articles.json';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://saileelarahasya-web.vercel.app';

    const leelaUrls = leelaArticles.map((article) => ({
        url: `${baseUrl}/leela/${article.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const bodhakathaUrls = bodhakathaArticles.map((article) => ({
        url: `${baseUrl}/bodhakatha/${article.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const staticUrls = [
        '',
        '/leela',
        '/bodhakatha',
        '/audio',
        '/live',
        '/glossary',
        '/ask',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.9,
    }));

    return [...staticUrls, ...leelaUrls, ...bodhakathaUrls];
}
