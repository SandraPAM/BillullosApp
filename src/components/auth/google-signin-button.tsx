
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C322 104 288.3 88 248 88c-73.2 0-132.3 59.2-132.3 132.3s59.1 132.3 132.3 132.3c76.9 0 111.2-51.8 115.8-77.9H248v-94.2h236.8c2.9 16.2 4.2 32.7 4.2 49.8z"></path>
  </svg>
);


export function GoogleSignInButton(props: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast({
            title: "Sign-in Successful",
            description: "Redirecting to your dashboard...",
        });
        router.push('/dashboard');
    } catch (error) {
        const authError = error as AuthError;
        let description = 'Could not sign in with Google. Please try again.';
        
        switch (authError.code) {
            case 'auth/popup-blocked':
                description = 'Sign-in pop-up was blocked by the browser. Please allow pop-ups for this site and try again.';
                break;
            case 'auth/popup-closed-by-user':
                description = 'Sign-in cancelled. The sign-in window was closed.';
                break;
            case 'auth/operation-not-allowed':
                description = 'Google Sign-In is not enabled. Please enable it in your Firebase console under Authentication > Sign-in method.';
                break;
            case 'auth/unauthorized-domain':
                description = 'This domain is not authorized for Google Sign-In. Please check your Firebase console settings and ensure the authDomain in src/lib/firebase/config.ts is correct.';
                break;
        }
        
        toast({
            variant: 'destructive',
            title: 'Sign-in Failed',
            description: description,
        });
        console.error("Google Sign-In Error:", authError);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" type="button" onClick={handleSignIn} {...props}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Google
    </Button>
  );
}
