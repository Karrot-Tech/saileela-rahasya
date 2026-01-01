import { SignInButton } from "@clerk/nextjs";
import { Lock } from "lucide-react";

interface AdminLoginPromptProps {
    isLoggedIn: boolean;
}

export default function AdminLoginPrompt({ isLoggedIn }: AdminLoginPromptProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 p-8 text-center space-y-6">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-10 h-10 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        {isLoggedIn ? 'Access Denied' : 'Admin Access Required'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {isLoggedIn
                            ? "Your account does not have administrator privileges. Please contact the system owner if you believe this is an error."
                            : "You must be logged in with an administrator account to view the admin console."
                        }
                    </p>
                </div>

                <div className="pt-4">
                    {!isLoggedIn ? (
                        <SignInButton mode="modal">
                            <button className="w-full bg-ochre text-white px-8 py-4 rounded-xl hover:bg-gold transition-all shadow-lg shadow-ochre/20 text-sm font-black uppercase tracking-widest active:scale-95">
                                Sign In to Console
                            </button>
                        </SignInButton>
                    ) : (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600 font-bold">
                            Current User ID is not authorized.
                        </div>
                    )}
                </div>

                <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest pt-4">
                    Saileela Rahasya Admin
                </div>
            </div>
        </div>
    );
}
