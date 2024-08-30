import NoSSRWrapper from "@/components/NoSSRWrapper";
import HeaderAndEditor from "@/components/HeaderAndEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/server";
import type { Note } from '@/lib/types';
import { redirect } from "next/navigation";

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
