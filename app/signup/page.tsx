import SignupComponent from "@/components/SignupComponent";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function checkSignedUp(){
    const supabase = createClient();
    const { data : {user} } = await supabase.auth.getUser();
    if(user){
        redirect('/') // Redirect to home page if user is already signed in
    }
    else return SignupComponent();
}

