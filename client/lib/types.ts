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

export enum JobStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
  ASSESSMENT = 'ASSESSMENT',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  ARCHIVED = 'ARCHIVED',
}

export type JobBoardEntry = {
  id: number;
  number: number;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  url: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  jobBoardTags: JobBoardTag[];
}

export type JobBoardTag = {
  id: number;
  name: string;
}
