// components/GoogleSignInButton.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

const GoogleSignInButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeGoogleSignIn = useCallback(() => {
    if (window.google && buttonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            signIn('google', { callbackUrl: '/' });
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
        });
      } catch (err) {
        setError('Failed to initialize Google Sign-In');
        console.error('Google Sign-In initialization error:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google) {
      initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    script.onerror = () => setError('Failed to load Google Sign-In script');

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [initializeGoogleSignIn]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div ref={buttonRef}></div>;
};

export default GoogleSignInButton;
