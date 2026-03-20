import {
  BookOpen,
  Bookmark,
  MessageCircle,
  Search,
  Star,
  Eye,
} from "lucide-react";

const manga = {
  title: "Demon Slayer: Kimetsu no Yaiba",
  subtitle: "Koyoharu Gotouge",
  statusTags: ["Action", "Adventure", "Fantasy", "Shonen", "Completed"],
  rating: 4.9,
  ranking: 205,
  description:
    "Tanjiro Kamado lives a modest but blissful life in the mountains with his family. One day, when he returns from town after selling charcoal in town, he finds his family slaughtered to prove off blood and a demon attack. Tanjiro rushes down the snowy mountain with his only survivor, his sister Nezuko, on his back. But on the way, Nezuko begins to snarl and growl, launching herself at Tanjiro...",
  cover:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
  banner:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
};

const chapters = [
  {
    id: 236,
    title: "Life Shining Across the Years",
    releasedAgo: "2 days ago",
    views: "12.5k",
  },
  {
    id: 203,
    title: "A World Without Demons",
    releasedAgo: "1 week ago",
    views: "45.2k",
  },
  {
    id: 202,
    title: "Voices of Encouragement",
    releasedAgo: "2 weeks ago",
    views: "50.1k",
  },
  {
    id: 202,
    title: "Let's Go Home",
    releasedAgo: "3 weeks ago",
    views: "62.8k",
  },
];

const comments = [
  {
    id: 1,
    user: "MangaKing99",
    time: "2 hours ago",
    text: "The ending was absolutely perfect. I cried so much. Can't believe it's finally over.",
  },
  {
    id: 2,
    user: "NezukoFan_01",
    time: "6 hours ago",
    text: "Does anyone know if there will be a sequel? Or a spin-off about the modern day descendants?",
  },
];

function HeaderStat({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-[72px] items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ChapterRow({ chapter }) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
      <td className="px-4 py-4 text-xs font-semibold text-slate-500">
        {chapter.id}
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-slate-800">
        {chapter.title}
      </td>
      <td className="px-4 py-4 text-sm text-slate-500">
        {chapter.releasedAgo}
      </td>
      <td className="px-4 py-4 text-sm text-slate-500">{chapter.views}</td>
      <td className="px-4 py-4 text-right">
        <button className="text-sm font-semibold text-violet-600 transition hover:text-violet-700">
          Read
        </button>
      </td>
    </tr>
  );
}

function CommentItem({ comment }) {
  return (
    <article className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
        alt={comment.user}
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-bold text-slate-900">{comment.user}</h4>
          <span className="text-xs text-slate-400">{comment.time}</span>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{comment.text}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
          <button className="transition hover:text-slate-700">142</button>
          <button className="transition hover:text-slate-700">Reply</button>
        </div>
      </div>
    </article>
  );
}

export default function OtakeMangaDetailsPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[22px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/70">
          <div className="relative h-40 w-full sm:h-56">
            <img
              src={manga.banner}
              alt={manga.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-900/10 to-transparent" />
          </div>

          <div className="relative px-5 pb-6 sm:px-7">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="-mt-14 shrink-0 sm:-mt-20">
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="h-48 w-32 rounded-xl border-4 border-white object-cover shadow-xl sm:h-64 sm:w-44"
                />
              </div>

              <div className="flex-1 pt-1 md:pt-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                      {manga.title}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-sky-700">
                      {manga.subtitle}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {manga.statusTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <HeaderStat
                      icon={Star}
                      label="Rating"
                      value={manga.rating}
                    />
                    <HeaderStat
                      icon={BookOpen}
                      label="Ranking"
                      value={manga.ranking}
                    />
                  </div>
                </div>

                <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-600">
                  {manga.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0d1733] px-5 text-sm font-semibold text-white shadow-md transition hover:brightness-110">
                    <BookOpen className="h-4 w-4" />
                    Start Reading
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    <Bookmark className="h-4 w-4" />
                    Add to Library
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  Chapter List
                </h2>
                <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:w-56">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Chapter Name</th>
                      <th className="px-4 py-3">Released</th>
                      <th className="px-4 py-3">Views</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.map((chapter, index) => (
                      <ChapterRow
                        key={`${chapter.id}-${index}`}
                        chapter={chapter}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 px-4 py-4 text-center">
                <button className="text-sm font-medium text-slate-500 transition hover:text-slate-800">
                  Load More Chapters
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-1">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Discussion (243)
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
                alt="Current user"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  rows={3}
                  placeholder="Join the discussion..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
                />
                <div className="mt-3 flex justify-end">
                  <button className="inline-flex h-10 items-center rounded-lg bg-[#0d1733] px-4 text-sm font-semibold text-white transition hover:brightness-110">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
              <Eye className="h-4 w-4" />
              Otake
            </div>
            <button className="transition hover:text-slate-900">
              Discover
            </button>
            <button className="transition hover:text-slate-900">
              Community
            </button>
            <button className="transition hover:text-slate-900">Legal</button>
          </div>
        </section>
      </div>
    </div>
  );
}
