import Link from 'next/link';
import { ArrowRight, Youtube, Facebook, Instagram } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] md:min-h-[75vh] space-y-6 md:space-y-10 text-center pt-2 md:pt-6">

      {/* Hero Section */}
      <div className="space-y-4 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 w-full px-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white mx-auto max-w-sm md:max-w-none">
          <img
            src="/hero-main.jpg"
            alt="Sai Baba - Meri Bhi Suno"
            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* <h1 className="text-4xl md:text-6xl font-bold text-ochre tracking-tight">
          Saileela Rahasya
        </h1> */}
        <p className="text-xl md:text-2xl text-gray-600 font-serif italic">
          &quot;The Secret of Sai&apos;s Plays Revealed&quot;
        </p>

        <div className="h-px w-24 bg-gold mx-auto my-6 opacity-50" />

        <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-lg mx-auto px-6 md:px-0">
          We have believed Sai for years, now let&apos;s learn something.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/leela"
          className="flex items-center justify-center space-x-2 bg-ochre text-white px-8 py-4 rounded-full font-bold hover:bg-orange-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <span>Start Reading Leela</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/live"
          className="flex items-center justify-center space-x-2 bg-white text-ochre border-2 border-ochre px-8 py-4 rounded-full font-bold hover:bg-orange-50 transition shadow-sm"
        >
          <span>Watch Live</span>
        </Link>
      </div>

      {/* Social Links */}
      <div className="pt-6 md:pt-10">
        <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest">Connect with us</p>
        <div className="flex space-x-6 justify-center">
          <a href="https://www.youtube.com/@saileelarahasya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition transform hover:scale-110">
            <Youtube className="w-8 h-8" />
          </a>
          <a href="https://www.facebook.com/people/Sai-Leela-Rahasya/100090802872602/#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition transform hover:scale-110">
            <Facebook className="w-8 h-8" />
          </a>
          <a href="https://www.instagram.com/saileelarahasya/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition transform hover:scale-110">
            <Instagram className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
}
