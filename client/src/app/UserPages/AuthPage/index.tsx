import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

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
          {searchParams.get("page") === "login" ? (
            <LoginForm loading={loading} setLoading={setLoading} />
          ) : (
            <SignUpForm loading={loading} setLoading={setLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
