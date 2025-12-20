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
        screenshots: [
            {
                src: '/screenshots/home.png',
                sizes: '390x844',
                type: 'image/png',
                label: 'Home Screen',
                form_factor: 'narrow'
            },
            {
                src: '/screenshots/leela.png',
                sizes: '390x844',
                type: 'image/png',
                label: 'Leela Library',
                form_factor: 'narrow'
            },
            {
                src: '/screenshots/home-desktop.png',
                sizes: '1280x800',
                type: 'image/png',
                label: 'Home Screen (Desktop)',
                form_factor: 'wide'
            },
            {
                src: '/screenshots/audio.png',
                sizes: '390x844',
                type: 'image/png',
                label: 'Sai Bhajans Player',
                form_factor: 'narrow'
            }
        ],
    };
}
