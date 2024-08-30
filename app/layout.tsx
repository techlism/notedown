import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notedown",
  description: "Make notes and stay organized",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user || null;
  //get all notes
  const { data: notes, error } = await supabase.from("notes").select("*").eq("user_id", user?.id);
  return (
    <html lang="en">
      <body className={`${inter.className} flex`}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Sidebar user={user} notes={notes} error={error} /> 
        <div className="flex-grow">
          {children}
        </div>
      </ThemeProvider>
      </body>
    </html>
  );
}
