# Notedown

Notedown is a self-host-friendly note-taking application built with Next.js and Supabase. It allows users to securely create, store, and manage their notes with encryption. The project is designed to be easily deployable on your own infrastructure.

## Features

- **User Authentication:** Secure user authentication powered by Supabase.
- **Encrypted Notes:** Notes are stored with encryption to ensure privacy and security.
- **Rich Text Editing:** Supports rich text note-taking with customizable titles and content.
- **Cover Images:** Optional cover images for notes.
- **Responsive Design:** Fully responsive design for use on mobile and desktop devices.
- **Self-Hosting:** Easily self-host the application with your own Supabase and PostgreSQL setup.

## Table Schema

Below is the table schema used to store notes in the Supabase database:

```sql
CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content bytea NOT NULL,
  encryption_key text NOT NULL,
  last_modified timestamp with time zone NULL DEFAULT current_timestamp,
  cover_image_url text NULL,
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
) TABLESPACE pg_default;
```

### Installation

1.Clone the repository:

```bash
git clone https://github.com/yourusername/notedown.git
cd notedown
```

2.Install the dependencies:

```bash
npm install
```

3.Create a `.env.local` file in the root directory and add the following environment variables (see `.env.example` for an example). You will need to create a new Project in Supabase and obtain the credentials.

4.Run the development server:

```bash
npm run dev
```

### Contributing

Contributions are welcome! Please send a pull request with your changes. 

---
Please give a ⭐ if you found this project interesting and helpful.
