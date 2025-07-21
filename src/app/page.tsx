import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Goal, Bot, Landmark } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import Logo from "@/components/logo";

export default function Home() {
  const features = [
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: "Budget Management",
      description: "Create and manage budgets with custom amounts and deadlines to keep your spending in check.",
    },
    {
      icon: <Goal className="h-8 w-8 text-primary" />,
      title: "Savings Goals",
      description: "Define and track your savings goals, from a new gadget to a down payment on a house.",
    },
    {
      icon: <Landmark className="h-8 w-8 text-primary" />,
      title: "Expense & Income Tracking",
      description: "Easily log expenses and savings contributions, with options to attach receipts and screenshots.",
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "AI-Powered Tips",
      description: "Receive personalized budgeting tips from our smart AI to help you save more effectively.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Master Your Money, Effortlessly
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              Billullos is the simple, smart, and secure way to manage your budgets, track savings, and achieve your financial dreams.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Image 
            src="/images/Gemini_Generated_Image_u3od5xu3od5xu3od.png"
            alt="Billullos app dashboard"
            width={1200}
            height={600}
            className="rounded-xl shadow-2xl mx-auto"
            data-ai-hint="dashboard finance"
          />
        </section>

        <section id="features" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">Everything You Need to Succeed</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                All the tools to take you from financial stress to financial success.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-background mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 font-headline text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
                <h2 className="font-headline text-3xl sm:text-4xl font-bold">Ready to Grow Your Wealth?</h2>
                <p className="mt-4 text-muted-foreground">
                    Join thousands of users who are taking control of their financial future with Billullos.
                </p>
                <div className="mt-8">
                    <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/signup">Start Your Journey Now</Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Billullos. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
