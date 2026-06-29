import BookshelfClient from "./bookshelf-client";

export const metadata = { title: "Bookshelf — Arun Baburaj" };

export type Book = {
  title: string;
  author: string;
  cover: string;
  status?: string;
  banger?: boolean;
  note?: string;
};

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1IY-ictcATAZNfcJajwkKCJlT7-b7SBwPl_q2RZ4ntCc/export?format=csv&gid=861814196";

async function getBooks(): Promise<Book[]> {
  const res = await fetch(SHEET_CSV_URL, {
    next: { revalidate: 3600 },
    redirect: "follow",
  });
  const text = await res.text();

  const lines = text.trim().split("\n");
  // skip header row
  return lines.slice(1).map((line) => {
    // parse CSV properly (handles quoted fields)
    const cols = parseCSVLine(line);
    const [title, author, cover, reading, category] = cols;
    const coverUrl = cover?.trim();
    return {
      title: title?.trim() || "",
      author: author?.trim() || "",
      cover: coverUrl
        ? coverUrl
        : `https://covers.openlibrary.org/b/title/${encodeURIComponent(title?.trim() || "")}-M.jpg`,
      status: reading?.trim().toLowerCase() === "yes" ? "Currently Reading" : undefined,
      banger: category?.trim().toLowerCase() === "banger",
    };
  }).filter((b) => b.title);
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export default async function BookshelfPage() {
  const books = await getBooks();
  return <BookshelfClient books={books} />;
}
