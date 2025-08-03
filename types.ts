
export interface User {
  $id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface LinkItem {
  id: string;
  longUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string; // ISO string date
}