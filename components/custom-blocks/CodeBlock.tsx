import type React from "react";
import { createReactBlockSpec } from "@blocknote/react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup"; // HTML
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-jsx";
// import 'prismjs/themes/prism-okaidia.min.css'; // You can choose a different theme

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { Separator } from "../ui/separator";

const TYPE = "codeblock";

const languageOptions = [
	{ value: "javascript", label: "JavaScript" },
	{ value: "python", label: "Python" },
	{ value: "css", label: "CSS" },
	{ value: "markup", label: "HTML" },
	{ value: "cpp", label: "CPP" },
	{ value: "c", label: "C" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "jsx", label: "JSX" },
];

export const CodeBlock = createReactBlockSpec(
	{
		type: TYPE,
		propSchema: {
			language: {
				default: "javascript",
				values: languageOptions.map((option) => option.value),
			},
			code: {
				default: "",
			},
		},
		content: "none",
	},
	{
		render: ({ block, editor }) => {
			const onInputChange = (value: string) => {
				editor.updateBlock(block, {
					props: { ...block.props, code: value },
				});
			};

			const onLanguageChange = (value: string) => {
				editor.updateBlock(block, {
					props: { ...block.props, language: value },
				});
			};
			const [isCopied, setIsCopied] = useState(false);
			const onCopy = () => {
				navigator.clipboard.writeText(block.props.code);
				setIsCopied(true);
				setTimeout(() => {
					setIsCopied(false);
				}, 1000);
			};

			return (
				<div className="grid grid-cols-1 gap-2 max-w-full min-w-[50%] border-2 rounded-md my-4">
					<div className="flex justify-between items-center max-w-fit gap-2 pt-2 pl-3">
						<Select
							value={block.props.language}
							onValueChange={(value : string) => onLanguageChange(value)}
						>
							<SelectTrigger className="max-w-[180px] text-sm rounded-sm bg-transparent">
								<SelectValue>
									{
										languageOptions.find(
											(option) => option.value === block.props.language,
										)?.label
									}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{languageOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							onClick={onCopy}
							className="max-w-max ease-in-out transition-all"
							variant={"ghost"}
						>
							{isCopied ? (
								<ClipboardCheckIcon size={14} />
							) : (
								<ClipboardIcon size={14} />
							)}
						</Button>
					</div>
					<Separator />
					<Editor
						value={block.props.code}
						onValueChange={onInputChange}
						highlight={(code) =>
							highlight(
								code,
								languages[block.props.language],
								block.props.language,
							)
						}
						padding={10}
						className="font-mono rounded-md w-full code-editor text-wrap overflow-auto"
						textareaClassName="codeblock-textarea"
						preClassName="codeblock-pre"
						readOnly={!editor.isEditable}
						autoFocus
					/>
				</div>
			);
		},
		toExternalHTML: ({ block }) => {
			return (
				<pre className={`language-${block.props.language}`}>
					<code>{block.props.code}</code>
				</pre>
			);
		},
	},
);