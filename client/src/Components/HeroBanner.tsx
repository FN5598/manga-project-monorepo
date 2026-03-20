import { Plus, Play } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-[#101935] shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
      <img
        src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600&q=80"
        alt="Featured manga banner"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1430] via-[#0d1430]/80 to-[#0d1430]/20" />

      <div className="relative z-10 max-w-xl px-7 py-7 sm:px-10 sm:py-10">
        <div className="mb-5 inline-flex items-center rounded-full bg-[#8b5cf6] px-3 py-1 text-[11px] font-semibold text-white shadow-md">
          🔥 Trending #1
        </div>

        <h1 className="max-w-md text-4xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl">
          Demon Slayer: Kimetsu no Yaiba
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
          Tanjiro Kamado lives a modest but blissful life in the mountains with
          his family. One day, when he returns from town, everything changes.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#f5d733] px-5 text-sm font-semibold text-slate-900 shadow-lg transition hover:brightness-105">
            <Play className="h-4 w-4 fill-current" />
            Read Now
          </button>

          <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/15">
            <Plus className="h-4 w-4" />
            Add to List
          </button>
        </div>
      </div>
    </section>
  );
}
