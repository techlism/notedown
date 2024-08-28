'use client';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LockIcon, MailIcon } from "lucide-react"
import Link from "next/link"
import { login } from '@/app/login/actions'
import { useState } from "react";
import * as EmailValidator from 'email-validator';
import { ErrorMessage } from "@/components/ErrorMessage";

export default function LoginComponent() {
  const [message, setMessage] = useState('');
  async function processLogin(event : FormData) {
    const { email , password } = Object.fromEntries(event.entries());
    if(!email || !password){
      setMessage("Please fill all the fields");
      setInterval(() => {
        setMessage('');
      }, 3000);
      return;
    }
    if(!EmailValidator.validate(email as string)){
      setMessage("Please enter a valid email");
      setInterval(() => {
        setMessage('');
      }, 3000);
      return;
    }
    await login(event);

  }
  return (
    <ScrollArea className="flex-grow h-[98lvh] m-auto border-l">
      <main className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md space-y-8 px-4 py-8 bg-card rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your Notedown account
            </p>
          </div>
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              {message ? <ErrorMessage message={message} /> : null}
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="pl-10"                  
                />
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10"                  
                />
              </div>
            </div>
            <Button formAction={processLogin} className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </ScrollArea>
  )
}