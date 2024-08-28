"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { signup } from "@/app/signup/actions";
import { useState } from "react";
import * as EmailValidator from "email-validator";
import { ErrorMessage } from "@/components/ErrorMessage";

export default function SignupComponent() {
	const [message, setMessage] = useState("");
	async function processSignup(event: FormData) {
		const { email, password } = Object.fromEntries(event.entries());
		if (!email || !password) {
			setMessage("Please fill all the fields");
			setInterval(() => {
				setMessage("");
			}, 3000);
			return;
		}
		if (EmailValidator.validate(email as string) === false) {
			setMessage("Please enter a valid email");
			setInterval(() => {
				setMessage("");
			}, 3000);
			return;
		}
		const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*(?:.*[0-9]){2})(?=.*[!@#$%^&*])(?=.{8,})/;
		if (!strongPass.test(password as string)) {
            setMessage(
                "Password should contain at least one lowercase, one uppercase, one number, one special character, and be at least 8 characters long",
            );
			setInterval(() => {
				setMessage("");
			}, 3000);
			return;
		}
		await signup(event);
	}
	return (
		<ScrollArea className="flex-grow h-[98lvh] m-auto border-l">
			<main className="flex items-center justify-center h-full bg-background">
				<div className="w-full max-w-md space-y-8 px-4 py-8 bg-card rounded-lg shadow-lg">
					<div className="text-center">
						<h2 className="text-3xl font-bold tracking-tight">
							Create an account
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Join Notedown and boost your productivity
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
									// type="email"
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
						<Button formAction={processSignup} className="w-full">
							Sign up
						</Button>
					</form>
					<p className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link href="/login" className="text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</main>
		</ScrollArea>
	);
}