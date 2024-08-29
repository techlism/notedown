'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, FileText, Settings, Compass, User as UserIcon, SidebarClose, SidebarOpen, Edit, Trash2Icon, TrashIcon, MoonIcon, SunDim } from 'lucide-react';
import type { User } from '@supabase/auth-js';
import type { Note } from '@/lib/types';
import type { PostgrestError } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { generateKey, exportKey } from '@/lib/utils';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
type SidebarProps = {
  user : User | null;
  notes : Note[] | null;
  error : PostgrestError | null;
}

function sortNotesByLastModified(notes : Note[] | null) {
  if(!notes){
    return null;
  }
  const newNotes = notes.filter(note => note.last_modified !== undefined);
  newNotes.sort((a,b) => Date.parse(b.last_modified || '') - Date.parse(a.last_modified || ''));
  return newNotes;
}

export default function Sidebar({ user, notes, error }: SidebarProps) {
  const params = useParams();
  const theme = useTheme();
  const currentNoteID = params?.notes_id as string;
  const [isExpanded, setIsExpanded] = useState(true);
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
      className="relative h-[98lvh] my-auto flex flex-col z-20 mt-2 bg-zinc-50 dark:bg-zinc-950 shadow-md rounded-md border"
      animate={{ width: isExpanded ? 250 : 70 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between p-4 h-16">
        <motion.a
          className="text-xl font-bold overflow-hidden whitespace-nowrap"
            animate= {{display: isExpanded ? 'block' : 'none'}}
            transition={{ duration: 0.1 }}
            href='/'
        >
          Notedown
        </motion.a>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={toggleSidebar} className='mx-auto'>
          {isExpanded ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
        </button>
      </div>

      <nav className="flex-grow justify-center items-center p-2">
          <Button
            onClick={createNewNoteAndRedirect}
            className="flex items-center w-full justify-start"
            variant={'ghost'}
          >
            <span className="w-5 h-5 flex items-center justify-center"><Edit/></span>
            <motion.span
              className="ml-4 whitespace-nowrap overflow-hidden"
              animate={{ opacity: isExpanded ? 1 : 0, display : isExpanded ? 'block' : 'none' }}
            >
              Create a New Note
            </motion.span>
          </Button>
          <Separator/>
          <ScrollArea className='h-[75lvh] mt-1'>
          {sortNotesByLastModified(notes)?.map((note) => (
            <div key={note.id} className='flex gap-2 justify-between mb-1 items-center'>
            <Button              
              onClick={() => router.push(`/notes/${note.id}`)}
              className={`w-full ${isExpanded ? 'justify-start' : 'justify-center'}`}
              variant={'ghost'}            
              >
              <span className="w-5 h-5 flex items-center justify-center"><FileText/></span>
              <motion.span
                className="ml-4 whitespace-nowrap overflow-hidden"
                animate={{ opacity: isExpanded ? 1 : 0, display : isExpanded ? 'block' : 'none' }}
              >
                {note.title.slice(0, 18)}
              </motion.span>
            </Button>
            <Button
              variant={'ghost'}
              // size={'icon'}
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              onClick={()=>deleteNote(note.id!)}
              className={`${isExpanded ? 'block' : 'hidden'} transition-all px-3 py-2 items-center`}
            >            
              <TrashIcon className='text-destructive/90' size={15}/>
            </Button>
            </div>

          ))}
          </ScrollArea>
      </nav>
      <div className="ml-2 flex items-center h-12 w-full">  
        <Button
            onClick={() => theme.setTheme(theme?.theme === 'dark' ? 'light' : 'dark')}
            variant={'ghost'}
          >
            <span className="w-5 h-5 flex items-center justify-center">{theme?.theme === 'dark' ? <MoonIcon/> : <SunDim/>}</span>
            <motion.span
              className="ml-4 whitespace-nowrap overflow-hidden"
              animate={{ opacity: isExpanded ? 1 : 0, display : isExpanded ? 'block' : 'none' }}
            >
              Switch to {theme?.theme === 'dark' ? 'Light' : 'Dark'} Mode
            </motion.span>
          </Button>                  
      </div>  
      <div className="h-12 ml-2">
        <motion.div className="flex items-center">
          <span className="w-5 h-5 flex items-center justify-center">
            <UserIcon size={20} />
          </span>
          {
            user ?
          
            <motion.span
            className="ml-4 whitespace-nowrap overflow-hidden"
          ><Link href="/account" className='hover:underline'>
            {`${user?.email?.slice(0, 12)}...`}
            </Link>
          </motion.span>          
          :           
          <motion.span className="ml-4 whitespace-nowrap overflow-hidden">
            <Link href="/login" className='hover:underline'>
            Login
            </Link>
          </motion.span>
         
          }
          
        </motion.div>
      </div>  
    </motion.aside>
  );
};
