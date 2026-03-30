import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signInWithGoogle, loginModalConfig } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const modalTitle = loginModalConfig?.title || 'Login';
  const modalMessage = loginModalConfig?.message || 'Save your addresses and track your orders faster.';

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const redirectTo = loginModalConfig?.redirectTo
        ? loginModalConfig.redirectTo.startsWith('http')
          ? loginModalConfig.redirectTo
          : window.location.origin + loginModalConfig.redirectTo
        : window.location.href;

      await signInWithGoogle({ redirectTo });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop: Semi-transparent white with intense blur */}
      <div 
        className="fixed inset-0 bg-white/60 backdrop-blur-xl cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal Card: Forces white background for a premium look */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_32px_128px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-500 border-t-8 border-[#EE4D2D]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-[#EE4D2D] shadow-inner">
            <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>ramen_dining</span>
          </div>
          
          {/* App Logo/Brand Anchor */}
          <div className="mb-6">
            <span className="text-4xl font-black italic text-[#EE4D2D] font-headline tracking-tighter">FuyFood</span>
          </div>
          
          <h2 className="font-headline text-2xl font-extrabold text-[#1b1c1c] mb-2">{modalTitle}</h2>
          <p className="text-[#5b403b] font-body max-w-[280px] mb-8 text-sm opacity-70">
            {modalMessage}
          </p>
          
          {/* Google Button */}
          <button 
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-4 bg-white border border-neutral-200 py-3.5 px-6 rounded-xl hover:bg-neutral-50 transition-all duration-200 active:scale-95 shadow-sm group hover:border-[#EE4D2D]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <div className="w-6 h-6 border-4 border-[#EE4D2D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            )}
            <span className="font-headline font-bold text-neutral-700 tracking-tight">
              {isSigningIn ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>
          
          {/* Alternative Links */}
          <div className="mt-6 flex flex-col gap-4">
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors text-xs font-bold uppercase tracking-widest p-2">
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
