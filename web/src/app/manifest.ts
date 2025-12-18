import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Sai Leela Rahasya',
        short_name: 'SLR',
        description: "Digital study guide for Krishnaji's teachings on Shirdi Sai Baba.",
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#cc7722',
        icons: [
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
