import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Logo from '@/components/logo';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" aria-label="Back to home">
          <Logo />
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
