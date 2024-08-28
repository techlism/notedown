'use client'

import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, insertOrUpdateBlock, type Block } from "@blocknote/core"
import { BlockNoteView } from "@blocknote/mantine"
import { CodeBlock } from "./custom-blocks/CodeBlock"
import { HorizontalLine, HRTYPE } from "./custom-blocks/HorizontalLine"
import { SuggestionMenuController, getDefaultReactSlashMenuItems, useCreateBlockNote } from "@blocknote/react"
import { Code, Minus } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import type { Note } from "@/lib/types"
import { encryptNote, importKey } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import "@blocknote/mantine/style.css";
const TYPE = "codeblock";
const AUTOSAVE_INTERVAL = 10000; // 10 seconds

type EditorBlockProps = {
    initialContent : Block[] | undefined,
    imageUrl: string,
    title: string,
    note : Note,
    setMarkdownUrl: (url: string) => void
}

const schema = BlockNoteSchema.create({
	blockSpecs: {
		...defaultBlockSpecs,
		codeblock: CodeBlock,
		[HRTYPE]: HorizontalLine,
	},
});

async function generateMarkdown(editor : typeof schema.BlockNoteEditor, title : string, imageUrl : string) {
    // it is actually formatted don't indent it
    const metadata = 
    `---
    title: ${title}
    date: "${new Date().toISOString().split('T')[0]}"
    excerpt: ""
    author:
      name: "Kundan"
      avatar: "https://github.com/techlism.png"
    coverImage: ${imageUrl}
---\n\n`;

    const blocks = editor.document.map((block) => {
        if (block.type === TYPE) {
            const originalCode = block.props.code;
            const language = block.props.language;
            // Remove any leading spaces or tabs from each line of the code
            const trimmedCode = originalCode
                .split("\n")
                .map((line) => line.trimStart())
                .join("\n");
            const code = `\`\`\`${language}\n${trimmedCode}\n\`\`\``;
            return { ...block, props: { ...block.props, code } };
        }
        return block;
    });

    const markdown = await editor.blocksToMarkdownLossy(blocks);
    // Remove any additional indentation before code blocks
    const cleanedMarkdown = markdown.replace(/^\s+```/gm, "```");

    const fullMarkdown = metadata + cleanedMarkdown;
    const blob = new Blob([fullMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    return url;
}

export const insertCode = (editor: typeof schema.BlockNoteEditor) => ({
	title: "Code Block",
	group: "Code",
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			//@ts-ignore
			type: TYPE,
		});
	},
	aliases: ["code"],
	icon: <Code />,
	subtext: "Insert a code block",
});

export const insertHorizontalLine = (
	editor: typeof schema.BlockNoteEditor,
) => ({
	title: "Line Break",
	group: "Line",
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			type: HRTYPE,
		});
	},
	aliases: ["break"],
	icon: <Minus />,
	subtext: "Insert a line break",
});

export default function EditorBlock({initialContent, note, imageUrl, title, setMarkdownUrl} : EditorBlockProps) {
    console.log("Initial Content",initialContent);
	const editor = useCreateBlockNote({ schema, initialContent : ((initialContent === undefined) || (initialContent.length === 0)) ? undefined : initialContent });
    const [error, setError] = useState<string | null>(null);
	const [lastEditTime, setLastEditTime] = useState<number>(Date.now());  
	const updateNoteInSupabase = useCallback(async () => {
		if (editor && note.id && note.encryption_key) {
		  try {
			const key = await importKey(note.encryption_key);
			const content = JSON.stringify(editor.document);
			const encryptedContent = await encryptNote(content, key);
			const supabase = createClient();
			const {data : user} = await supabase.auth.getUser()
			if(!user){
				throw new Error("Unable to find your account. Please login again or signup.");
			}
			// console.log(encryptedContent);
			const { data, error } = await supabase
			.from('notes')
			.update({ title : title, content : encryptedContent, cover_image_url : imageUrl, last_modified : new Date().toISOString() })
			.eq('id', note.id)
			.select();					
			// console.log(data);
			if (error) {
				console.error('Error updating note:', error);
			  throw error;
			}
		  } catch (err) {
			console.error('Error updating note:', err);
			setError(`Failed to update note: ${err instanceof Error ? err.message : String(err)}`);
		  }
		}
	  }, [editor, note.id, note.encryption_key, title, imageUrl]);    

	const handleChange = useCallback(() => {
		setLastEditTime(Date.now());
		if (editor) {
			// console.log(editor.document);
		  generateMarkdown(editor, title, imageUrl).then(setMarkdownUrl);
		}
	}, [editor, title, imageUrl, setMarkdownUrl]);
    
// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    const timeoutId = setTimeout(() => {
        updateNoteInSupabase();
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timeoutId);
    }, [lastEditTime, updateNoteInSupabase]);	
      
	const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
		if (event.ctrlKey && event.key === 's') {
		  event.preventDefault();
		  updateNoteInSupabase();
		}
	}, [updateNoteInSupabase]);
    
    if(error){
        return <div>{error}</div>
    }          
    return(
            <BlockNoteView
				editor={editor}				
				slashMenu={false}
				theme={"dark"}
				onChange={handleChange}
                onKeyDown={handleKeyDown}
			>
				<SuggestionMenuController
					triggerCharacter={"/"}
					getItems={async (query) =>
						filterSuggestionItems(
							[
								...getDefaultReactSlashMenuItems(editor),
								insertCode(editor),
								insertHorizontalLine(editor),
							],
							query,
						)
					}
				/>
			</BlockNoteView>        
    )
}