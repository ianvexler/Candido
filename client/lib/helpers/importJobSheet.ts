import { read as readXlsx, utils as xlsxUtils } from "xlsx";
import { JobStatus } from "@/lib/types";
import { bulkImportJobBoardEntries } from "@/api/resources/jobBoardEntries/bulkImportJobBoardEntries";

const VALID_STATUSES = new Set(Object.values(JobStatus));

const normalizeKey = (key: string) =>
  String(key ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getRowValue = (row: Record<string, unknown>, ...keys: string[]): string => {
  const normalizedRow = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [normalizeKey(k), v])
  );

  for (const key of keys) {
    const val = normalizedRow[normalizeKey(key)];

    if (val != null && val !== "") {
      return String(val).trim();
    }
  }
  return "";
};

const STATUS_ALIASES: Record<string, JobStatus> = {
  "IN PROGRESS": JobStatus.PENDING,
  "IN_PROGRESS": JobStatus.PENDING,
  INTERVIEWING: JobStatus.INTERVIEW,
  OFFER: JobStatus.OFFERED,
};

const parseStatus = (value: string): JobStatus => {
  const upper = value.trim().toUpperCase().replace(/\s+/g, " ");

  if (VALID_STATUSES.has(upper as JobStatus)) {
    return upper as JobStatus;
  }

  if (STATUS_ALIASES[upper]) {
    return STATUS_ALIASES[upper];
  }
  return JobStatus.PENDING;
};

export const importJobSheet = async (file: File): Promise<number> => {
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension !== "xlsx" && extension !== "xls" && extension !== "csv") {
    throw new Error("Invalid file extension");
  }

  const data = await new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    if (extension === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });

  const workbook = readXlsx(data, {
    type: extension === "csv" ? "string" : "array",
  });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsxUtils.sheet_to_json<Record<string, unknown>>(sheet);

  if (rows.length === 0) {
    throw new Error("No data found in spreadsheet");
  }

  const entries = rows
    .map((row) => {
      const title = getRowValue(row, "Title", "Job Title", "title");
      const company = getRowValue(row, "Company", "company");

      if (!title || !company) {
        return null;
      }

      const location = getRowValue(row, "Location", "location");
      const salary = getRowValue(row, "Salary", "salary");
      const url = getRowValue(row, "URL", "Url", "url", "Link");
      const statusRaw = getRowValue(row, "Status", "status");
      const status = parseStatus(statusRaw);

      return {
        title,
        company,
        location,
        salary,
        url,
        description: "",
        status,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  if (entries.length === 0) {
    return 0;
  }

  await bulkImportJobBoardEntries(entries);
  return entries.length;
};
