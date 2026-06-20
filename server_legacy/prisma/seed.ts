import { prisma } from "../lib/prisma.js";
import { JobStatus } from "../generated/prisma/enums.js";
import bcrypt from "bcrypt";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "ianvexler@gmail.com" },
    update: {},
    create: {
      email: "ianvexler@gmail.com",
      name: "Ian Vexler",
      password: await bcrypt.hash("password", 10),
    },
  });
  console.log("Users created");

  await prisma.jobBoardEntry.deleteMany({ where: { userId: user.id } });
  await prisma.jobBoardTag.deleteMany({ where: { userId: user.id } });

  const jobBoardEntries = [
    { title: "Software Engineer", company: "Google", status: JobStatus.PENDING, userId: user.id, number: 1, location: "Mountain View", salary: "$180k–$250k" },
    { title: "Product Manager", company: "Microsoft", status: JobStatus.PENDING, userId: user.id, number: 2, location: undefined, salary: undefined },
    { title: "Data Scientist", company: "Stripe", status: JobStatus.PENDING, userId: user.id, number: 3, location: "San Francisco", salary: "$150k–$220k" },
    { title: "Frontend Developer", company: "Vercel", status: JobStatus.PENDING, userId: user.id, number: 4, location: "Remote", salary: undefined },
    { title: "DevOps Engineer", company: "AWS", status: JobStatus.PENDING, userId: user.id, number: 5, location: undefined, salary: "$130k–$170k" },
    { title: "Backend Engineer", company: "Spotify", status: JobStatus.APPLIED, userId: user.id, number: 1, location: "New York", salary: "$140k–$190k" },
    { title: "Full Stack Developer", company: "Notion", status: JobStatus.APPLIED, userId: user.id, number: 2, location: undefined, salary: undefined },
    { title: "UX Designer", company: "Figma", status: JobStatus.APPLIED, userId: user.id, number: 3, location: "San Francisco", salary: "$120k–$160k" },
    { title: "Security Engineer", company: "Cloudflare", status: JobStatus.ASSESSMENT, userId: user.id, number: 1, location: "Austin", salary: "$150k–$200k" },
    { title: "Mobile Engineer", company: "Linear", status: JobStatus.ASSESSMENT, userId: user.id, number: 2, location: undefined, salary: undefined },
    { title: "Staff Engineer", company: "Netflix", status: JobStatus.INTERVIEW, userId: user.id, number: 1, location: "Los Gatos", salary: "$200k+" },
    { title: "Engineering Manager", company: "Meta", status: JobStatus.INTERVIEW, userId: user.id, number: 2, location: undefined, salary: "$180k–$250k" },
    { title: "Technical Lead", company: "Airbnb", status: JobStatus.OFFERED, userId: user.id, number: 1, location: "San Francisco", salary: undefined },
    { title: "Platform Engineer", company: "GitHub", status: JobStatus.ACCEPTED, userId: user.id, number: 1, location: "Remote", salary: "$160k–$210k" },
    { title: "Solutions Architect", company: "Salesforce", status: JobStatus.REJECTED, userId: user.id, number: 1, location: undefined, salary: undefined },
    { title: "QA Engineer", company: "Atlassian", status: JobStatus.REJECTED, userId: user.id, number: 2, location: "Sydney", salary: "$110k–$145k" },
    { title: "Site Reliability Engineer", company: "Datadog", status: JobStatus.ARCHIVED, userId: user.id, number: 1, location: "New York", salary: "$155k–$195k" },
  ];

  await prisma.jobBoardEntry.createMany({
    data: jobBoardEntries.map(({ location, salary, ...rest }) => ({
      ...rest,
      ...(location != null && { location }),
      ...(salary != null && { salary }),
    })),
  });
  console.log("Job board entries created");

  const jobBoardTags = [
    { name: "Remote", userId: user.id },
    { name: "Hybrid", userId: user.id },
    { name: "On-site", userId: user.id },
    { name: "TypeScript", userId: user.id },
    { name: "Python", userId: user.id },
    { name: "Go", userId: user.id },
    { name: "React", userId: user.id },
    { name: "Startup", userId: user.id },
    { name: "Enterprise", userId: user.id },
    { name: "Full-time", userId: user.id },
    { name: "Contract", userId: user.id },
    { name: "Senior", userId: user.id },
  ];
  await prisma.jobBoardTag.createMany({ data: jobBoardTags });
  console.log("Job board tags created");

  const entries = await prisma.jobBoardEntry.findMany({ where: { userId: user.id }, orderBy: { id: "asc" } });
  const tags = await prisma.jobBoardTag.findMany({ where: { userId: user.id }, orderBy: { id: "asc" } });

  const pickRandomIndices = (max: number, count: number): number[] => {
    const indices = Array.from({ length: max }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j]!, indices[i]!];
    }
    return indices.slice(0, count);
  };

  for (const entry of entries) {
    const tagCount = Math.floor(Math.random() * 4) + 1;
    const tagIndices = pickRandomIndices(tags.length, Math.min(tagCount, tags.length));

    if (tagIndices.length === 0) continue;

    await prisma.jobBoardEntry.update({
      where: { id: entry.id },
      data: {
        jobBoardTags: {
          connect: tagIndices.map((i) => ({ id: tags[i]!.id })),
        },
      },
    });
  }
  console.log("Job board entry tags created");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });