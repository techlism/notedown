import LandingPageAnimation from "@/components/LandingPageAnimation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/server";
import { StickyNoteIcon, TimerIcon, CombineIcon } from "lucide-react";
import Link from "next/link";

const features = [
	{
		icon: StickyNoteIcon,
		title: "Powerful Note-Taking",
		description:
			"Capture your thoughts, ideas, and research in rich, formatted notes.",
	},
	{
		icon: TimerIcon,
		title: "Seamless Task Management",
		description:
			"Organize your to-dos, set due dates, and track progress with ease.",
	},
	{
		icon: CombineIcon,
		title: "Markdown Support",
		description:
			"Download your notes in Markdown format for easy sharing and wider use.",
	},
];

export default async function Component() {
	const supabase = createClient();
	const { data: userData } = await supabase.auth.getUser();
	return (
		<ScrollArea className="flex-grow h-[98lvh] m-2 rounded-md border shadow-md">
			<main>
				<section className="bg-white py-12 md:py-24 lg:py-32 dark:text-primary-foreground min-h-[98lvh] flex items-center justify-center">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
							<div className="flex flex-col justify-center space-y-4">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
									Unleash Your Productivity with Notedown
								</h1>
								<p className="max-w-[600px] opacity-80 md:text-xl">
									Notedown is a powerful note-taking app
									that helps you stay organized and focused.
								</p>
								<p className="opacity-60 text-sm">
									(Sorry for that total white screen even in dark mode)
								</p>
								<div className={`flex flex-col gap-2 min-[400px]:flex-row ${userData.user === null ? 'inline-flex' : 'hidden' }`}>
									<Link
										href="/signup"
										className={`inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
											bg-primary-foreground text-primary hover:bg-primary-foreground/90
									`}
									>
										Try Notedown
									</Link>
									{userData.user === null ?
									<Link
										href="/login"
										className={`inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
													border border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary

									`}
									>
										Login
									</Link> : null}
								</div>
							</div>
							<LandingPageAnimation/>
						</div>
					</div>
				</section>
				<section className="py-12 md:py-24 lg:py-32 bg-background border-t">
					<div className="container px-4 md:px-6 text-center">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
							Powerful Features for Your Productivity
						</h2>
						<p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-12">
							Notedown offers a suite of tools to help you stay organized and
							focused, from note-taking to task management and collaboration.
						</p>
						<div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:gap-12">
							{features.map(({ icon: Icon, title, description }) => (
								<div key={title} className="grid gap-1">
									<div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12 mx-auto">
										<Icon className="w-6 h-6" />
									</div>
									<h3 className="text-lg font-bold">{title}</h3>
									<p className="text-muted-foreground">{description}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-muted-foreground">
					&copy; 2024 Notedown. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex sm:gap-6">
					<Link				
						href="https://github.com/techlism/notedown"
						className="text-xs hover:underline underline-offset-4"
					>
						GitHub
					</Link>
				</nav>
			</footer>
		</ScrollArea>
	);
}