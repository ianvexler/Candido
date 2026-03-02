import { read as readXlsx, utils as xlsxUtils } from "xlsx";
import { JobStatus } from "@/lib/types";
import { bulkImportJobBoardEntries } from "@/api/resources/jobBoardEntries/bulkImportJobBoardEntries";
import type { BulkImportEntry } from "@/api/resources/jobBoardEntries/bulkImportJobBoardEntries";

const VALID_STATUSES = new Set(Object.values(JobStatus));

const TITLE_HEADERS = ["title", "job title", "position", "role"];
const COMPANY_HEADERS = ["company", "company name", "employer", "organization"];

const normalizeKey = (key: string) =>
  String(key ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\uFEFF/g, "");

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

const findHeaderRowIndex = (sheet: { [key: string]: unknown }): number => {
  const rawRows = xlsxUtils.sheet_to_json<(string | number)[]>(sheet, { header: 1 });
  const maxScan = Math.min(rawRows.length, 30);

  for (let i = 0; i < maxScan; i++) {
    const row = rawRows[i] ?? [];
    const cells = (Array.isArray(row) ? row : []).map((c) => normalizeKey(String(c ?? "")));
    
    const hasTitle = cells.some((c) => TITLE_HEADERS.includes(c));
    const hasCompany = cells.some((c) => COMPANY_HEADERS.includes(c));
    if (hasTitle && hasCompany) {
      return i;
    }
  }
  return 0;
};

const parseRowsToEntries = (rows: Record<string, unknown>[]): BulkImportEntry[] => {
  const entries: BulkImportEntry[] = [];
  for (const row of rows) {
    const title = getRowValue(row, "Title", "Job Title", "title");
    const company = getRowValue(row, "Company", "company");
    
    if (!title || !company) {
      continue;
    }

    const location = getRowValue(row, "Location", "location");
    const salary = getRowValue(row, "Salary", "salary");
    const url = getRowValue(row, "URL", "Url", "url", "Link");
    const statusRaw = getRowValue(row, "Status", "status");
    const status = parseStatus(statusRaw);

    entries.push({
      title,
      company,
      ...(location && { location }),
      ...(salary && { salary }),
      ...(url && { url }),
      description: "",
      status,
    });
  }
  return entries;
};

export const parseJobSheet = async (file: File): Promise<BulkImportEntry[]> => {
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
      reject(new Error("Failed to read file"));
    };
    if (extension === "csv") {
      reader.readAsText(file, "UTF-8");
    } else {
      reader.readAsArrayBuffer(file);
    }
  });

  const workbook = readXlsx(data, {
    type: extension === "csv" ? "string" : "array",
  });

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const headerRowIndex = findHeaderRowIndex(sheet);

    const rows = xlsxUtils.sheet_to_json<Record<string, unknown>>(sheet, {
      ...(headerRowIndex > 0 && { range: headerRowIndex }),
    });

    if (rows.length === 0) {
      continue;
    }

    const entries = parseRowsToEntries(rows);
    if (entries.length > 0) {
      return entries;
    }
  }

  throw new Error("No valid job entries found in spreadsheet");
};

export const importJobSheet = async (file: File): Promise<number> => {
  const entries = await parseJobSheet(file);
  if (entries.length === 0) return 0;
  await bulkImportJobBoardEntries(entries);
  return entries.length;
};
