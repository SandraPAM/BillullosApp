"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      const errorMessage = `Please provide the Firebase configuration for your project.

You can find this information in the Firebase console:

1. Go to your project\'s settings: https://console.firebase.google.com/project/?/settings/general.
2. In the "General" tab, scroll down to the "Your apps" section.
3. Select the web app you\'re working with.
4. In the "Firebase SDK snippet" section, select "Config".
5. Copy the values for:
  * \`apiKey\`
  * \`authDomain\`
  * \`projectId\`
  * \`storageBucket\`
  * \`messagingSenderId\`
  * \`appId\` 
6. Paste the corresponding values into the \`.env\` file.`;
      console.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser(firebaseUser as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertTitle>Missing Firebase Configuration</AlertTitle>
          <AlertDescription>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};