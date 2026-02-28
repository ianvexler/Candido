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
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
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
  cvText?: string;
  cvFilename?: string;
  cvOriginalFilename?: string;
  coverLetterText?: string;
  coverLetterFilename?: string;
  coverLetterOriginalFilename?: string;
}

export type JobBoardTag = {
  id: number;
  name: string;
}

export const JobEntryFileTypes = ["CV", "Cover Letter"] as const;
export type JobEntryFileType = (typeof JobEntryFileTypes)[number];