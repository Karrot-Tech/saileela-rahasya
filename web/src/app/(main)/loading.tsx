export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            {/* Pulsing Logo */}
            <div className="relative w-20 h-20 animate-pulse">
                <div className="absolute inset-0 bg-ochre/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-white p-4 rounded-full shadow-xl border border-ochre/10">
                    <div className="w-12 h-12 border-t-4 border-r-4 border-ochre rounded-full animate-spin" />
                </div>
            </div>

            {/* Loading text */}
            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-gray-800 tracking-wider uppercase animate-pulse">
                    Loading Saileela...
                </h3>
                <p className="text-xs text-ochre font-serif italic">
                    "Shraddha & Saburi"
                </p>
            </div>
        </div>
    );
}
