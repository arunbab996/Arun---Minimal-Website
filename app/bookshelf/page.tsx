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

export const books: Book[] = [
  { title: "The Tokyo Zodiac Murders", author: "Soji Shimada", cover: "https://m.media-amazon.com/images/I/81cXk8qaGfL._SL1500_.jpg", status: "Currently Reading" },
  { title: "Lonely Planet Pocket New York City", author: "John Garry", cover: "https://m.media-amazon.com/images/I/81j-0l12rFL._SL1500_.jpg", status: "Currently Reading" },
  { title: "How to Fail at Almost Everything and Still Win Big", author: "Scott Adams", cover: "https://m.media-amazon.com/images/I/714Cfym-cnL._SL1388_.jpg" },
  { title: "Co-Intelligence", author: "Ethan Mollick", cover: "https://covers.openlibrary.org/b/id/14805433-M.jpg" },
  { title: "The Difference Between God and Larry Ellison", author: "Mike Wilson", cover: "https://covers.openlibrary.org/w/id/432368-M.jpg", banger: true, note: "The most unhinged founder biography I've read." },
  { title: "Superintelligence", author: "Nick Bostrom", cover: "https://covers.openlibrary.org/b/isbn/9780199678112-M.jpg" },
  { title: "Steve Jobs", author: "Walter Isaacson", cover: "https://covers.openlibrary.org/b/isbn/9781451648539-M.jpg" },
  { title: "American Kingpin", author: "Nick Bilton", cover: "https://covers.openlibrary.org/b/isbn/9781591848141-M.jpg", banger: true, note: "Reads like a thriller. Could not put it down." },
  { title: "Rich Dad, Poor Dad", author: "Robert T. Kiyosaki", cover: "https://covers.openlibrary.org/b/isbn/9780751532715-M.jpg" },
  { title: "Let My People Go Surfing", author: "Yvon Chouinard", cover: "https://covers.openlibrary.org/b/isbn/9780143037835-M.jpg" },
  { title: "The Bitcoin Standard", author: "Saifedean Ammous", cover: "https://covers.openlibrary.org/b/id/11936602-M.jpg" },
  { title: "Zen and the Art of Motorcycle Maintenance", author: "Robert M. Pirsig", cover: "https://covers.openlibrary.org/b/isbn/9780060589462-M.jpg" },
  { title: "Rework", author: "Jason Fried", cover: "https://covers.openlibrary.org/b/isbn/9780307463746-M.jpg" },
  { title: "Elon Musk", author: "Ashlee Vance", cover: "https://covers.openlibrary.org/b/isbn/9780062301239-M.jpg" },
  { title: "Shoe Dog", author: "Philip H. Knight", cover: "https://m.media-amazon.com/images/I/71m3HEJJl5L._SL1500_.jpg", banger: true, note: "Required reading for anyone building anything." },
  { title: "Digital Minimalism", author: "Cal Newport", cover: "https://covers.openlibrary.org/b/id/10174401-M.jpg", banger: true, note: "Changed how I think about attention." },
  { title: "Zero to One", author: "Peter A. Thiel & Blake Masters", cover: "https://covers.openlibrary.org/b/isbn/9780804139298-M.jpg" },
  { title: "The War of Art", author: "Steven Pressfield", cover: "https://covers.openlibrary.org/b/isbn/9780446691437-M.jpg" },
  { title: "Finding My Virginity", author: "Richard Branson", cover: "https://covers.openlibrary.org/b/isbn/9780735219427-M.jpg" },
  { title: "How to Get Rich", author: "Felix Dennis", cover: "https://covers.openlibrary.org/b/isbn/9780091921668-M.jpg", banger: true, note: "Brutally honest. No fluff." },
  { title: "Rich Dad's Cashflow Quadrant", author: "Robert T. Kiyosaki", cover: "https://covers.openlibrary.org/b/isbn/9780446677479-M.jpg" },
  { title: "Way of the Wolf", author: "Jordan Belfort", cover: "https://covers.openlibrary.org/b/id/14747285-M.jpg" },
  { title: "Harry Potter and the Deathly Hallows", author: "J. K. Rowling", cover: "https://covers.openlibrary.org/b/isbn/9781408865453-M.jpg" },
  { title: "Angels and Demons", author: "Dan Brown", cover: "https://covers.openlibrary.org/b/isbn/9780552161268-M.jpg" },
  { title: "Can't Hurt Me", author: "David Goggins", cover: "https://covers.openlibrary.org/b/isbn/9781544507859-M.jpg" },
  { title: "A Short History of Nearly Everything", author: "Bill Bryson", cover: "https://covers.openlibrary.org/b/isbn/9780767908184-M.jpg" },
  { title: "Brief Answers to the Big Questions", author: "Stephen Hawking", cover: "https://covers.openlibrary.org/b/isbn/9781984819192-M.jpg" },
  { title: "The Basics of Bitcoins and Blockchains", author: "Antony Lewis", cover: "https://covers.openlibrary.org/b/isbn/9781633538009-M.jpg" },
  { title: "Extreme Ownership", author: "Leif Babin & Jocko Willink", cover: "https://covers.openlibrary.org/b/id/8312790-M.jpg" },
  { title: "Measure What Matters", author: "John Doerr", cover: "https://covers.openlibrary.org/b/isbn/9780525538349-M.jpg" },
  { title: "Creative Selection", author: "Ken Kocienda", cover: "https://covers.openlibrary.org/b/isbn/9781250194473-M.jpg" },
  { title: "The Great Mental Models", author: "Farnam Street", cover: "https://covers.openlibrary.org/b/isbn/9781999449001-M.jpg" },
  { title: "So Good They Can't Ignore You", author: "Cal Newport", cover: "https://covers.openlibrary.org/b/isbn/9781455509102-M.jpg" },
  { title: "Who Moved My Cheese?", author: "Spencer Johnson", cover: "https://covers.openlibrary.org/b/isbn/9780091883768-M.jpg" },
  { title: "Awaken The Giant Within", author: "Tony Robbins", cover: "https://covers.openlibrary.org/b/id/475958-M.jpg" },
  { title: "Kitchen Confidential", author: "Anthony Bourdain", cover: "https://covers.openlibrary.org/b/isbn/9780060899226-M.jpg", banger: true, note: "Chaotic, vivid, and deeply human." },
  { title: "Replay", author: "Ken Grimwood", cover: "https://covers.openlibrary.org/b/isbn/9780688161125-M.jpg" },
  { title: "Psycho-Cybernetics", author: "Maxwell Maltz", cover: "https://covers.openlibrary.org/b/isbn/9780399176135-M.jpg" },
  { title: "Trillion Dollar Coach", author: "Alan Eagle, Eric Schmidt & Jonathan Rosenberg", cover: "https://covers.openlibrary.org/b/isbn/9780062839268-M.jpg" },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", cover: "https://covers.openlibrary.org/b/isbn/9781544514215-M.jpg" },
  { title: "The Alchemist", author: "Paulo Coelho", cover: "https://covers.openlibrary.org/b/isbn/9788172234980-M.jpg" },
  { title: "Principles", author: "Ray Dalio", cover: "https://covers.openlibrary.org/b/isbn/9781508243243-M.jpg" },
  { title: "#AskGaryVee", author: "Gary Vaynerchuk", cover: "https://covers.openlibrary.org/b/isbn/9780062273123-M.jpg" },
  { title: "The Man Who Solved the Market", author: "Gregory Zuckerman", cover: "https://covers.openlibrary.org/b/isbn/9780241309728-M.jpg", banger: true, note: "The Medallion Fund story is wild." },
  { title: "No Rules Rules", author: "Reed Hastings", cover: "https://covers.openlibrary.org/b/id/10524294-M.jpg" },
  { title: "Losing My Virginity", author: "Richard Branson", cover: "https://covers.openlibrary.org/b/isbn/9780812932294-M.jpg", banger: true, note: "Proof that audacity is a strategy." },
  { title: "The Concise Mastery", author: "Robert Greene", cover: "https://covers.openlibrary.org/b/isbn/9781846681561-M.jpg" },
  { title: "Four Thousand Weeks", author: "Oliver Burkeman", cover: "https://covers.openlibrary.org/b/isbn/9780374159122-M.jpg" },
  { title: "Captivate", author: "Vanessa van Edwards", cover: "https://covers.openlibrary.org/b/isbn/9780399564482-M.jpg" },
  { title: "Unlimited Power", author: "Tony Robbins", cover: "https://covers.openlibrary.org/b/isbn/9780684845777-M.jpg" },
  { title: "From Third World to First", author: "Lee Kuan Yew", cover: "https://covers.openlibrary.org/b/isbn/9780060197766-M.jpg" },
  { title: "Secrets of Sand Hill Road", author: "Scott Kupor", cover: "https://covers.openlibrary.org/b/id/14669093-M.jpg" },
  { title: "The Cold Start Problem", author: "Andrew Chen", cover: "https://m.media-amazon.com/images/I/41qNHQKq2xL._SY445_SX342_FMwebp_.jpg", banger: true, note: "Best framework for thinking about network effects." },
  { title: "Mastering the VC Game", author: "Jeffrey Bussgang", cover: "https://covers.openlibrary.org/b/isbn/9781591843252-M.jpg" },
  { title: "Let's Talk Money", author: "Monika Halan", cover: "https://covers.openlibrary.org/b/isbn/9789352779390-M.jpg" },
  { title: "How I Almost Blew it", author: "Sidharth Rao", cover: "https://covers.openlibrary.org/b/isbn/9789388754378-M.jpg" },
  { title: "Kings of Crypto", author: "Jeff John Roberts", cover: "https://m.media-amazon.com/images/I/81kW6NHc46L._SL1500_.jpg" },
  { title: "Wanting", author: "Luke Burgis", cover: "https://covers.openlibrary.org/b/isbn/9781250262486-M.jpg" },
  { title: "Vagabonding", author: "Rolf Potts", cover: "https://covers.openlibrary.org/b/id/9283857-M.jpg", banger: true, note: "Rethinks the entire idea of travel." },
  { title: "A Beginner's Guide to Japan", author: "Pico Iyer", cover: "https://covers.openlibrary.org/b/isbn/9780451493958-M.jpg" },
  { title: "Build", author: "Tony Fadell", cover: "https://covers.openlibrary.org/b/isbn/9781787634114-M.jpg", banger: true, note: "Practical and opinionated. Loved every page." },
  { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", cover: "https://covers.openlibrary.org/b/isbn/9780593321201-M.jpg" },
  { title: "The Network State", author: "Balaji S. Srinivasan", cover: "https://covers.openlibrary.org/b/id/14569476-M.jpg" },
  { title: "The Pathless Path", author: "Paul Millerd", cover: "https://covers.openlibrary.org/b/id/14840712-M.jpg" },
  { title: "The Fund", author: "Rob Copeland", cover: "https://covers.openlibrary.org/b/isbn/9781250276933-M.jpg" },
  { title: "Excellent Advice for Living", author: "Kevin Kelly", cover: "https://covers.openlibrary.org/b/isbn/9780593654521-M.jpg" },
  { title: "Million Dollar Weekend", author: "Noah Kagan", cover: "https://covers.openlibrary.org/b/id/14625512-M.jpg" },
  { title: "The Anthology of Balaji", author: "Balaji Srinivasan & Eric Jorgenson", cover: "https://m.media-amazon.com/images/I/31Ajrqg6FSL._SY445_SX342_FMwebp_.jpg" },
  { title: "Read Write Own", author: "Chris Dixon", cover: "https://m.media-amazon.com/images/I/71xFo8y2yUL._SL1500_.jpg" },
  { title: "Money Trap", author: "Alok Sama", cover: "https://covers.openlibrary.org/b/isbn/9781250332844-M.jpg" },
  { title: "The Art of Spending Money", author: "Morgan Housel", cover: "https://covers.openlibrary.org/b/id/15142229-M.jpg" },
];

export default function BookshelfPage() {
  return <BookshelfClient books={books} />;
}
