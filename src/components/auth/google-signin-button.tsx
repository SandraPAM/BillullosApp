"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
    // Placeholder for actual Firebase Google sign-in
    try {
        console.log("Signing in with Google");
        // await signInWithGoogle();
        toast({
            title: "Sign-in Successful",
            description: "Redirecting to your dashboard...",
        });
        // Simulate API call
        setTimeout(() => {
            router.push('/dashboard');
            setIsLoading(false);
        }, 1000);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Sign-in Failed',
            description: 'Could not sign in with Google. Please try again.',
        });
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
