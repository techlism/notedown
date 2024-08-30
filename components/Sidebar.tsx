'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, TrashIcon, MoonIcon, SunDim, UserIcon, SidebarClose, SidebarOpen } from 'lucide-react';
import type { User } from '@supabase/auth-js';
import type { Note } from '@/lib/types';
import type { PostgrestError } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { generateKey, exportKey } from '@/lib/utils';
import { Button } from './ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

type SidebarProps = {
  user: User | null;
  notes: Note[] | null;
  error: PostgrestError | null;
}

function sortNotesByLastModified(notes: Note[] | null) {
  if (!notes) return null;
  const newNotes = notes.filter(note => note.last_modified !== undefined);
  newNotes.sort((a, b) => Date.parse(b.last_modified || '') - Date.parse(a.last_modified || ''));
  return newNotes;
}

export default function Sidebar({ user, notes, error }: SidebarProps) {
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const currentNoteID = params?.notes_id as string;
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const toggleSidebar = () => setIsExpanded(!isExpanded);

  async function createNewNoteAndRedirect(){
    if(!user){
      return;
    }
    const supabase = createClient();  
    const key = await generateKey();
    const keyBase64 = await exportKey(key);
    const emptyContent = new Uint8Array([0]);
    const dataToInsert : Note = {
      user_id : user.id,
      title : 'New Note',
      content : emptyContent,
      encryption_key : keyBase64,
      cover_image_url : null,      
    }
    const { data, error } = await supabase.from('notes')
    .insert([dataToInsert])
    .select()
    if(!error){
      router.push(`/notes/${data[0].id}`);
      router.refresh();
    }                
  }
  async function deleteNote(noteID : string) {
    const supabase = createClient();
    const { error} = await supabase.from('notes').delete().eq('id',noteID)
    if(error === null){
      if(currentNoteID === noteID){
        // the deleted Note is currently opened
        router.push('/');
        router.refresh();
        return;
      }
      router.refresh();
    }
  }

  return (
    <motion.aside
      className="relative h-[98lvh] my-auto flex flex-col z-20 mt-2 bg-background shadow-md rounded-md border border-l-0 bg-zinc-50 dark:bg-zinc-950"
      animate={{ width: isExpanded ? 250 : 80 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between py-4 px-2 mx-2 h-16">
        <motion.a
          className="text-xl font-bold overflow-hidden whitespace-nowrap"
          animate={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? 'block' : 'none' }}
          transition={{ duration: 0.1 }}
          href='/'
        >
          Notedown
        </motion.a>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className='mx-auto'>
          {isExpanded ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
        </Button>
      </div>

      
        <Button
          onClick={createNewNoteAndRedirect}
          className={`mb-2 ${isExpanded ? 'justify-start' : 'justify-center items-center'} mx-2`}
          variant="ghost"
          disabled={!user}
        >
          <Edit className="h-4 w-4" />
          <motion.span
            animate={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? 'inline-flex' : 'none' }}
            className='ml-2'
          >
            Create a New Note
          </motion.span>
        </Button>
        <Separator className="my-2" />
        <ScrollArea className="flex-grow px-3">
        {sortNotesByLastModified(notes)?.map((note) => (
          <div key={note.id} className='flex items-center mb-1'>
            <Button
              onClick={() => router.push(`/notes/${note.id}`)}
              className={`w-full justify-start ${isExpanded ? 'justify-start' : 'justify-center'}`}
              variant="ghost"
            >
              <FileText className="h-4 w-4" />
              <motion.span
                className="truncate ml-2"
                animate={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? 'inline-flex' : 'none' }}
              >
                {note.title.slice(0, 18)}
              </motion.span>
            </Button>
            {isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className='text-primary hover:text-destructive'
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                onClick={() => deleteNote(note.id!)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </ScrollArea>
      
      <div className="mt-auto p-2 space-y-2">
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="ghost"
          className={`w-full justify-start ${isExpanded ? 'justify-start' : 'justify-center'}`}
        >
          {theme === 'dark' ? <MoonIcon className="h-4 w-4" /> : <SunDim className="h-4 w-4" />}
          <motion.span
            animate={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? 'inline-flex' : 'none' }}
            className='ml-2'
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </motion.span>
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${isExpanded ? 'justify-start' : 'justify-center'}`}
          asChild
        >
          <Link href={user ? "/account" : "/login"}>
            <UserIcon className="h-4 w-4" />
            <motion.span
              className="ml-2 truncate"
              animate={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? 'inline-flex' : 'none' }}
            >
              {user ? `${user.email?.slice(0, 18)}...` : 'Login'}
            </motion.span>
          </Link>
        </Button>
      </div>
    </motion.aside>
  );
}