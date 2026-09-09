import BookshelfClient from "./bookshelf-client";


export type Book = {
  title: string;
  author: string;
  cover: string;
  status?: string;
  banger?: boolean;
  tbr?: boolean;
  spine?: string;
  spineInk?: string;
  note?: string;
};

/**
 * The To Be Read pile.
 *
 * Kept here rather than in the sheet so the pile works without editing the
 * spreadsheet, but the sheet still wins: tag a book "TBR" in its Category
 * column and it joins these. Anything already on the shelf is filtered out
 * below, so a book cannot sit in the pile and in All Books at once.
 *
 * Covers are OpenLibrary IDs, each checked to be a real image rather than the
 * blank placeholder OpenLibrary returns for unknown editions. The handful with
 * no edition on OpenLibrary carry an empty cover and get a typeset one drawn
 * for them instead of a blank slab.
 */
const TBR: { title: string; author: string; cover: string; spine: string; spineInk: string }[] = [
  { title: "There Is No Antimemetics Division", author: "qntm", cover: "https://covers.openlibrary.org/b/id/11457905-L.jpg", spine: "#7b5b2c", spineInk: "#f2ece0" },
  { title: "Design of the 20th Century", author: "Charlotte & Peter Fiell", cover: "https://covers.openlibrary.org/b/id/9251654-L.jpg", spine: "#1a233d", spineInk: "#f2ece0" },
  { title: "Monet", author: "Christoph Heinrich", cover: "https://covers.openlibrary.org/b/id/552324-L.jpg", spine: "#9aa190", spineInk: "#17150f" },
  { title: "New York: Portrait of a City", author: "Reuel Golden", cover: "https://covers.openlibrary.org/b/id/8877275-L.jpg", spine: "#847974", spineInk: "#17150f" },
  { title: "The Joy of X", author: "Steven Strogatz", cover: "https://covers.openlibrary.org/b/id/9266506-L.jpg", spine: "#827b70", spineInk: "#17150f" },
  { title: "1984", author: "George Orwell", cover: "https://covers.openlibrary.org/b/id/8745958-L.jpg", spine: "#7f4f47", spineInk: "#f2ece0" },
  { title: "Madonna in a Fur Coat", author: "Sabahattin Ali", cover: "https://covers.openlibrary.org/b/id/12762238-L.jpg", spine: "#beb7aa", spineInk: "#17150f" },
  { title: "The Avengers", author: "Stan Lee & Jack Kirby", cover: "https://covers.openlibrary.org/b/id/890189-L.jpg", spine: "#643b3b", spineInk: "#f2ece0" },
  { title: "Thinking with Type", author: "Ellen Lupton", cover: "https://covers.openlibrary.org/b/id/812786-L.jpg", spine: "#a0a365", spineInk: "#17150f" },
  { title: "The History of Graphic Design", author: "Jens Müller", cover: "https://covers.openlibrary.org/b/id/13195164-L.jpg", spine: "#949492", spineInk: "#17150f" },
  { title: "Maintenance: Of Everything", author: "Stewart Brand", cover: "https://covers.openlibrary.org/b/id/15227296-L.jpg", spine: "#9b9989", spineInk: "#17150f" },
  { title: "The Scaling Era: An Oral History of AI", author: "Dwarkesh Patel", cover: "", spine: "", spineInk: "" },
  { title: "Watchmen", author: "Alan Moore & Dave Gibbons", cover: "https://covers.openlibrary.org/b/id/7774899-L.jpg", spine: "#423d07", spineInk: "#f2ece0" },
  { title: "The New York Times Explorer: 100 Trips Around the World", author: "Barbara Ireland", cover: "", spine: "", spineInk: "" },
  { title: "Spider-Man: Across the Spider-Verse — The Art of the Movie", author: "Ramin Zahed", cover: "", spine: "", spineInk: "" },
  { title: "Design: The Definitive Visual History", author: "DK", cover: "", spine: "", spineInk: "" },
  { title: "101 Things I Learned in Psychology School", author: "Tim Bono", cover: "https://covers.openlibrary.org/b/id/14807628-L.jpg", spine: "#9da7af", spineInk: "#17150f" },
  { title: "101 Things I Learned in Product Design School", author: "Sung Jang & Martin Thaler", cover: "https://covers.openlibrary.org/b/id/11081114-L.jpg", spine: "#babbbb", spineInk: "#17150f" },
  { title: "Tokyo on Foot", author: "Florent Chavouet", cover: "https://covers.openlibrary.org/b/id/12299339-L.jpg", spine: "#705d5a", spineInk: "#f2ece0" },
  { title: "My Travels in Japan", author: "Audry Nicklin", cover: "", spine: "", spineInk: "" },
  { title: "Il Dolce Far Niente", author: "Lucy Laucht", cover: "https://covers.openlibrary.org/b/id/7195740-L.jpg", spine: "#867768", spineInk: "#17150f" },
];

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
      // Additive only: a "TBR" in the Category column opts a book into the
      // pile. Nothing above changes.
      tbr: category?.trim().toLowerCase().includes("tbr") ?? false,
    };
  }).filter((b) => b.title);
}

/** Sheet books plus the local TBR pile, with the pile de-duplicated. */
async function getAllBooks(): Promise<Book[]> {
  const shelf = await getBooks();
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
  const onShelf = new Set(shelf.map((b) => norm(b.title)));
  const pile: Book[] = TBR
    .filter((b) => !onShelf.has(norm(b.title)))
    .map((b) => ({ ...b, tbr: true }));
  return [...pile, ...shelf];
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
  const books = await getAllBooks();
  return <BookshelfClient books={books} />;
}
