import { ChevronLeft, ChevronRight } from "lucide-react";
import MangaCard from "../Components/MangaCard";
import HeroBanner from "../Components/HeroBanner";
import Header from "../Components/Header";
import ContinueCard from "../Components/ContinueCard";

export type ItemType = {
  id: number;
  title: string;
  cover: string;
  chapter: string;
  progress: number;
  page: string;
  rating: number;
  author: string;
};

const genres = ["All", "Shonen", "Seinen", "Romance"];

const continueReading = [
  {
    id: 1,
    title: "Jujutsu Kaisen",
    chapter: "Chapter 234: Inhuman Makyo Shinjuku",
    progress: 82,
    page: "Page 12/19",
    cover:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    title: "One Piece",
    chapter: "Chapter 1092: Kuma the Tyrant",
    progress: 28,
    page: "Page 4/22",
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    title: "Chainsaw Man",
    chapter: "Chapter 143: Normal Life",
    progress: 64,
    page: "Page 18/20",
    cover:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=300&q=80",
  },
];

const popular = [
  {
    id: 1,
    title: "Attack on Titan",
    author: "Hajime Isayama",
    rating: 9.8,
    cover:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Naruto",
    author: "Masashi Kishimoto",
    rating: 9.5,
    cover:
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Bleach",
    author: "Tite Kubo",
    rating: 9.2,
    cover:
      "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    title: "My Hero Academia",
    author: "Kohei Horikoshi",
    rating: 8.9,
    cover:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    title: "Fullmetal Alchemist",
    author: "Hiromu Arakawa",
    rating: 9.0,
    cover:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    title: "Death Note",
    author: "Tsugumi Ohba",
    rating: 9.7,
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80",
  },
];

export default function OtakeHomePage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <HeroBanner />

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Continue Reading
            </h2>
            <button className="text-sm font-medium text-violet-600 transition hover:text-violet-700">
              View History →
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {continueReading.map((item) => (
              <ContinueCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Popular This Week
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                  <button
                    key={genre}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      index === 0
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-transparent text-slate-500 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {popular.map((item) => (
              <MangaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
