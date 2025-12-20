
export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in duration-500">
            {/* Elegant Spinning Logo Container */}
            <div className="relative">
                {/* Outer decorative ring */}
                <div className="absolute -inset-4 border border-ochre/10 rounded-full animate-pulse" />

                <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* The Spinning Border */}
                    <div className="absolute inset-0 border-b-2 border-l-2 border-ochre rounded-full animate-spin" style={{ animationDuration: '1.2s' }} />

                    {/* The Inner Box / Logo placeholder */}
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-ochre/10 flex items-center justify-center animate-pulse">
                            <div className="w-4 h-4 rounded-sm bg-ochre" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin-specific Loading Text */}
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-ochre rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-ochre rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-ochre rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <h3 className="text-sm font-black text-gray-900 tracking-[0.3em] uppercase">
                    Admin Console
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Initializing System Data...
                </p>
            </div>
        </div>
    );
}
