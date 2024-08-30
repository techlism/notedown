import NoSSRWrapper from "@/components/NoSSRWrapper";
import HeaderAndEditor from "@/components/HeaderAndEditor";
import { createClient } from "@/utils/supabase/server";
import type { Note } from '@/lib/types';
import { redirect } from "next/navigation";

import type { Metadata, ResolvingMetadata } from 'next'


export async function generateMetadata(
  { params }: { params: { notes_id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { notes_id } = params;
  const supabase = createClient();
  let { data: note } = await supabase.from('notes').select('*').eq('id', notes_id).single();
  note = note as Note;

  if (!note) {
    return {
      title: 'Notedown - Note not found',
      description: 'Note not found',
    };
  }

  const url = new URL("https://notedown-techlism.vercel.app");

  return {
    title: `${note.title} | Notedown`,
    description: `${note.title || ''} - Notedown`,
    metadataBase: url,
    applicationName: "Notedown",
    authors: [{ name: note.user_id }],
  };
}

export default async function Page({params} : {params: {notes_id: string}}) {
	const { notes_id } = params;
	const supabase = createClient();
	const {data : userData} = await supabase.auth.getUser();
	const { data: notes } = await supabase.from('notes').select('*').eq('id', notes_id).eq('user_id', userData.user?.id).single();
	if (userData.user === null) {
		redirect('/signup');
	}
	if(!notes && userData.user===null){
		redirect('/signup');
	}
	if(!notes) return(
		<div>
			Invalid note
		</div>
	)
	const note: Note = notes;
	return (
		<main className="flex-grow h-[98lvh] m-2">
			<NoSSRWrapper>
					<HeaderAndEditor note={note} />
			</NoSSRWrapper>
		</main>
	);
}
