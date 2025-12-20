import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Saileela Rahasya',
        short_name: 'Saileela Rahasya',
        description: "Discover the secret plays and profound teachings of Shirdi Sai Baba through recorded Leelas, Bodhakathas, and spiritual guidance.",
        start_url: '/',
        display: 'standalone',
        background_color: '#4a2511',
        theme_color: '#cc7722',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
