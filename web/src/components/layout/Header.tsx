import Link from 'next/link';
import UtilityMenu from '@/components/layout/UtilityMenu';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 flex items-center justify-center px-4 shadow-sm md:fixed md:top-4 md:right-4 md:left-auto md:w-auto md:h-auto md:bg-transparent md:border-none md:shadow-none md:justify-end md:px-0 pointer-events-none">
            <div className="max-w-7xl w-full flex items-center justify-between md:justify-end pointer-events-auto">
                <Link href="/" className="flex items-center gap-3 md:hidden min-w-0 flex-shrink">
                    <img
                        src="/saileela-logo.png"
                        alt="Saileela Rahasya"
                        className="h-10 w-auto object-contain flex-none"
                    />
                    <span className="text-lg font-bold text-ochre tracking-wide whitespace-nowrap truncate">Saileela Rahasya</span>
                </Link>

                <UtilityMenu />
            </div>
        </header>
    );
}
