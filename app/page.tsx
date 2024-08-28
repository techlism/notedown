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
		title: "Collaborative Workspace",
		description:
			"Share notes, tasks, and ideas with your team and work together seamlessly.",
	},
];

export default async function Component() {   
	return (
		<ScrollArea className="flex-grow h-[98lvh] m-auto rounded-tr-md rounded-br-md">
			<main>
				<section className="py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground min-h-[98lvh] flex items-center justify-center">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
							<div className="flex flex-col justify-center space-y-4">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
									Unleash Your Productivity with Notedown
								</h1>
								<p className="max-w-[600px] opacity-80 md:text-xl">
									Notedown is a powerful note-taking and task management app
									that helps you stay organized and focused.
								</p>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									{["Try Notedown", "Login"].map((text, index) => (
										<Link
											key={text}
											href="#"
											className={`inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
												index === 0
													? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
													: "border border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
											}`}
										>
											{text}
										</Link>
									))}
								</div>
							</div>
							<img
								src="https://placehold.co/600x400"
								width={550}
								height={550}
								alt="Notedown Hero"
								className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
							/>
						</div>
					</div>
				</section>
				<section className="py-12 md:py-24 lg:py-32">
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
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					{["Terms of Service", "Privacy"].map((text) => (
						<Link
							key={text}
							href="#"
							className="text-xs hover:underline underline-offset-4"
						>
							{text}
						</Link>
					))}
				</nav>
			</footer>
		</ScrollArea>
	);
}