import { createClient } from "@/utils/supabase/server";

export default async function Notes() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    return(
        <main className="border rounded-md m-2 h-[98lvh] flex justify-center items-center bg-zinc-50 dark:bg-zinc-950">
            <div>
                {
                    userData.user === null ? 
                    <p className="font-medium text-lg">
                        You are not logged in. Please login/signup and expand the side-bar to create a new note or edit an existing one.
                    </p> :
                    <p className="font-medium text-lg">
                        Please expand the side-bar to create a new note or edit an existing one.
                    </p>
                }
            </div>
        </main>
    )
}