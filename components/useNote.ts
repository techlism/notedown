import { useState, useEffect, useCallback } from 'react';
import type { Block } from "@blocknote/core";
import type { Note } from "@/lib/types";
import { hexToUint8Array, importKey, encryptNote, decryptNote } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const AUTOSAVE_INTERVAL = 10000; // 10 seconds

export function useNote(initialNote: Note) {
  const [note, setNote] = useState(initialNote);
  const [content, setContent] = useState<Block[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastEditTime, setLastEditTime] = useState<number>(Date.now());

  useEffect(() => {
    const loadContent = async () => {
      if (note.content && note.encryption_key) {
        try {
          const key = await importKey(note.encryption_key);
          const contentArray = hexToUint8Array(note.content as string);
          if (contentArray.length === 1 && contentArray[0] === 0) {
            setContent([]);
            return;
          }
          const decryptedContent = await decryptNote(contentArray, key);
          const parsedContent = JSON.parse(decryptedContent);
          setContent(parsedContent);
        } catch (err) {
          if (err instanceof Error && err.message === "The provided data is too small") {
            setContent([]);
            return;
          }
          setError(`Failed to load content: ${err instanceof Error ? err.message : String(err)}`);
        }
      } else {
        setContent([]);
      }
    };
    
    loadContent();
  }, [note]);

  const updateNote = useCallback(async (newContent: Block[], newTitle?: string, newImageUrl?: string) => {
    if (note.id && note.encryption_key) {
      try {
        const key = await importKey(note.encryption_key);
        const contentString = JSON.stringify(newContent);
        const encryptedContent = await encryptNote(contentString, key);
        const supabase = createClient();
        const { data: user } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Unable to find your account. Please login again or signup.");
        }
        const updateData = {
          content: encryptedContent,
          last_modified: new Date().toISOString(),
          ...(newTitle && { title: newTitle }),
          ...(newImageUrl && { cover_image_url: newImageUrl }),
        };
        const { data, error } = await supabase
          .from('notes')
          .update(updateData)
          .eq('id', note.id)
          .select();
        if (error) throw error;
        setNote(prevNote => ({ ...prevNote, ...updateData }));
        setContent(newContent);
      } catch (err) {
        console.error('Error updating note:', err);
        setError(`Failed to update note: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }, [note]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content) {
        updateNote(content);
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timeoutId);
  }, [lastEditTime, updateNote, content]);

  const handleChange = useCallback((newContent: Block[]) => {
    setLastEditTime(Date.now());
    setContent(newContent);
  }, []);

  return { note, content, error, updateNote, handleChange };
}