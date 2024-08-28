type UUID = string;

export interface Note {
  id?: UUID;
  user_id: UUID;
  title: string;
  content: Uint8Array | string; // For storing encrypted blob
  encryption_key: string;
  last_modified?: string; // ISO 8601 date string
  cover_image_url: string | null;
}