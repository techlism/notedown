"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Edit } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface HeaderProps {
	imageUrl?: string;
	title?: string;
	setImageUrl : (imageUrl: string) => void;
	setTitle : (title: string) => void;
	markdownURL : string;
}

const Header: React.FC<HeaderProps> = ({title,setImageUrl,setTitle,markdownURL,imageUrl}) => {
	// State variable for dialog
	const [isOpen, setIsOpen] = useState(false);

	const handleSave = () => {
		setIsOpen(false);
	};

    const handleDialogClose = () => {
        setIsOpen((prev)=>!prev);
    }

	return (
		<>
			<div className="relative w-full h-[30lvh] overflow-hidden rounded-md shadow-sm mb-2 border pb-0">
				{imageUrl ? (
					<div
						className="absolute inset-0 bg-cover bg-center transition-all duration-300 ease-in-out rounded-md"
						style={{
							backgroundImage: `url(${imageUrl})`,		
						}}
					/>
				) : null}
				<div className="absolute inset-0 flex flex-col justify-end">
                    {/* <div>
                        <Sidebar />
                    </div> */}
					<div className="flex justify-between p-2 w-full bg-gray-900 rounded-sm bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 items-center">
						<h1 className="text-xl md:text-3xl lg:text-4xl xl:text-4xl font-bold z-10 text-white/80">{title}</h1>
						<div className="flex justify-between items-center gap-4 flex-wrap">
							<a href={markdownURL} download={`${title}.md`} className="p-3 rounded-md bg-primary-foreground border-1 hover:opacity-90">
								<DownloadIcon className="h-4 w-4"/>
							</a>
							<Dialog open={isOpen} onOpenChange={handleDialogClose}>
								<DialogTrigger asChild>
									<Button variant="outline" size="icon">
										<Edit className="h-5 w-4" />
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Edit Header</DialogTitle>
									</DialogHeader>
									<div className="space-y-4 mt-4">
										<Input
											value={imageUrl}
											onChange={(e) => setImageUrl(e.target.value)}
											placeholder="Image URL"
										/>
										<Input
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											placeholder="Title"
										/>
										<Button onClick={handleSave}>Save</Button>                                    
									</div>
								</DialogContent>
							</Dialog>
						</div>
						
					</div>
				</div>
			</div>
		</>
	);
};

export default Header;