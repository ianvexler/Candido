export type User = {
  id: number;
  email: string;
  name: string;
  sessions: Session[];
  setupCompleted: boolean;
  admin: boolean;
  lastLoginAt: Date;
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

export const jobStatusColors: Record<JobStatus, string> = {
  PENDING: "bg-slate-300",
  APPLIED: "bg-yellow-500",
  ASSESSMENT: "bg-cyan-500",
  INTERVIEW: "bg-indigo-500",
  OFFERED: "bg-emerald-500",
  REJECTED: "bg-red-400",
  ACCEPTED: "bg-green-600",
  ARCHIVED: "bg-black",
};

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
  cvKey?: string;
  cvFilename?: string;
  coverLetterText?: string;
  coverLetterKey?: string;
  coverLetterFilename?: string;
}

export type JobBoardTag = {
  id: number;
  name: string;
}

export const JobEntryFileTypes = ["CV", "Cover Letter"] as const;
export type JobEntryFileType = (typeof JobEntryFileTypes)[number];