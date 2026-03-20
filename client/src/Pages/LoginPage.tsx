export default function LoginPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#d8cff4] relative flex items-center justify-center px-4 py-10">
      {/* radial burst background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 55%, rgba(255,255,255,0.28) 0deg 6deg, transparent 6deg 12deg)",
          maskImage:
            "radial-gradient(circle at center, black 0%, black 62%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, black 62%, transparent 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="mb-5 inline-flex rounded-full bg-[#f2d43d] px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
          MangaDictionary Login
        </div>

        <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-[#0b1730]">
          Welcome MangaDictionary!
        </h1>

        <div className="rounded-[28px] border border-white/30 bg-white/18 p-8 text-left shadow-[0_20px_50px_rgba(88,72,140,0.12)] backdrop-blur-sm">
          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email Address
              </label>
              <input
                type="email"
                className="h-12 w-full rounded-xl border border-transparent bg-white px-4 text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Password
              </label>
              <input
                type="password"
                className="h-12 w-full rounded-xl border border-transparent bg-white px-4 text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-slate-500">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="font-medium text-slate-800 transition hover:opacity-70 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#07122e] text-base font-semibold text-white shadow-[0_10px_24px_rgba(7,18,46,0.28)] transition hover:translate-y-[1px] cursor-pointer"
            >
              Create an Account
            </button>

            <div className="py-1">
              <div className="flex justify-center">
                <div className="w-full border-t border-slate-300/80 place-self-center"></div>
                <span className="bg-transparent px-3 text-sm text-slate-500">
                  or
                </span>
                <div className="w-full border-t border-slate-300/80 place-self-center"></div>
              </div>
            </div>

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white text-base font-medium text-slate-700 shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition hover:bg-slate-50 cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.19 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.287 4.337-17.694 10.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.17 0-9.627-3.33-11.283-7.946l-6.522 5.025C9.566 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.084 5.57h.003l6.19 5.238C36.974 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
