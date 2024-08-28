import LoginComponent from "@/components/LoginComponent";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  if (user) {
    redirect('/');
  } else return <LoginComponent/>;
}