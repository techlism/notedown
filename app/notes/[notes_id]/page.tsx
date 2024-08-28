import NoSSRWrapper from "@/components/NoSSRWrapper";
import HeaderAndEditor from "@/components/HeaderAndEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/server";
import type { Note } from '@/lib/types';

export default async function Page({params} : {params: {notes_id: string}}) {
	const { notes_id } = params;
	const supabase = createClient();
	const { data: notes } = await supabase.from('notes').select('*').eq('id', notes_id).single();
	if (!notes) {
		return <div>Not found</div>;
	}
	const note: Note = notes;
	return (
		<main>
			<NoSSRWrapper>
				<ScrollArea className="flex-grow h-[98lvh] p-2 m-2 bg-gray-50 shadow-md rounded-md border">
					<HeaderAndEditor note={note} />
				</ScrollArea>
			</NoSSRWrapper>
		</main>
	);
}
