"use client";
import type { Block } from "@blocknote/core";
import { useEffect, useState } from "react";
import Header from "./Header";
import type { Note } from "@/lib/types";
import { hexToUint8Array, importKey, decryptNote } from "@/lib/utils";
import EditorBlock from "./EditorBlock";
import Loading from "./Loading";
import ErrorScreen from "./ErrorScreen";

type EditorWithMarkdownDownloadProps = {
    note: Note;
};

export default function HeaderAndEditor({
    note,
}: EditorWithMarkdownDownloadProps) {
    const [markdownUrl, setMarkdownUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState(
        note.cover_image_url ||
        "https://unsplash.com/photos/b0XSjnITSoA/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI0NTY5OTM0fA&force=true",
    );
    const [title, setTitle] = useState(note.title);
    const [initialContent, setInitialContent] = useState<Block[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialContent = async () => {
            if (note.content && note.encryption_key) {
                try {
                    const key = await importKey(note.encryption_key);
                    const contentArray = hexToUint8Array(note.content as string);
                    if (contentArray.length === 1 && contentArray[0] === 0) {
                        setInitialContent([]);
                    } else {
                        const decryptedContent = await decryptNote(contentArray, key);
                        const parsedContent = JSON.parse(decryptedContent);
                        setInitialContent(parsedContent);
                    }
                } catch (err) {
                    if (
                        err instanceof Error &&
                        err.message === "The provided data is too small"
                    ) {
                        setInitialContent([]);
                    } else {
                        setError(
                            `Failed to load initial content: ${err instanceof Error ? err.message : String(err)}`,
                        );
                    }
                }
            } else {
                setInitialContent([]);
            }
            setIsLoading(false);
        };

        loadInitialContent();
    }, [note]);

    if (isLoading) {
        return <Loading/>
    }

    if (error) {
        return <ErrorScreen errorMessage={error} />
    }

    return (
        <div className="">
            <Header
                title={title}
                setTitle={setTitle}
                setImageUrl={setImageUrl}
                markdownURL={markdownUrl || ""}
                imageUrl={imageUrl}
            />
            <EditorBlock
                initialContent={initialContent || undefined}
                note={note}
                imageUrl={imageUrl}
                title={title}
                setMarkdownUrl={setMarkdownUrl}
            />
        </div>
    );
}