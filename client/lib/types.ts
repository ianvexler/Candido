export type User = {
  id: number;
  email: string;
  name: string;
  sessions: Session[];
}

export type Session = {
  token: string;
  expiresAt: Date;
}