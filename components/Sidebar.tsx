'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, FileText, Settings, Compass, User as UserIcon, SidebarClose, SidebarOpen, Edit } from 'lucide-react';
import type { User } from '@supabase/auth-js';
import type { Note } from '@/lib/types';
import type { PostgrestError } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { generateKey, exportKey } from '@/lib/utils';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

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
  return (
    <motion.aside
      className="relative h-[98lvh] my-auto flex flex-col z-20 mt-2 bg-gray-50 shadow-md rounded-md border"
      animate={{ width: isExpanded ? 240 : 70 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between p-4 h-16">
        <motion.h1
          className="text-xl font-bold overflow-hidden whitespace-nowrap"
            animate= {{display: isExpanded ? 'block' : 'none'}}
            transition={{ duration: 0.1 }}
        >
          Acme Corp.
        </motion.h1>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={toggleSidebar} className='mx-auto'>
          {isExpanded ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
        </button>
      </div>

      <nav className="flex-grow justify-center items-center p-2">
          <Button
            onClick={createNewNoteAndRedirect}
            className="flex items-center px-4 py-3 hover:bg-accent hover:rounded-md bg-transparent text-primary"
          >
            <span className="w-5 h-5 flex items-center justify-center"><Edit/></span>
            <motion.span
              className="ml-4 whitespace-nowrap overflow-hidden"
              animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
            >
              Create a New Note
            </motion.span>
          </Button>
          {sortNotesByLastModified(notes)?.map((note) => (
            <Button
              key={note.id}
              onClick={() => router.push(`/notes/${note.id}`)}
              className="flex flex-grow items-center px-4 py-3 hover:bg-accent hover:rounded-md bg-transparent text-primary"
            >
              <span className="w-5 h-5 flex items-center justify-center"><FileText/></span>
              <motion.span
                className="ml-4 whitespace-nowrap overflow-hidden"
                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
              >
                {note.title.slice(0, 12)}
              </motion.span>
            </Button>
          ))}
      </nav>

      <div className="p-4 h-16 ml-2">
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
