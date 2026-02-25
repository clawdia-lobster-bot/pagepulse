"use client";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-6 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tighter text-black dark:text-zinc-50 mb-2">
            Your site's SEO health,<br className="hidden sm:block" /> on autopilot
          </h1>
          <p className="max-w-lg text-xl text-zinc-700 dark:text-zinc-300 mb-8">
            Automate your technical SEO audits and unlock actionable insights. Join the waitlist and get a free, instant SEO check-up for your site!
          </p>
          <form className="w-full flex flex-col sm:flex-row gap-3 items-stretch max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email for invite/waitlist"
              className="flex-1 border px-4 py-3 rounded-xl text-lg text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition hover:bg-blue-700">
              Join Waitlist
            </button>
          </form>
          <div className="w-full max-w-md flex flex-col mt-8">
            <input
              type="url"
              placeholder="Enter your website URL e.g. https://example.com"
              className="flex-1 border px-4 py-3 rounded-xl text-lg text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold mt-3 transition hover:from-blue-600 hover:to-green-500">
              Run Free SEO Audit
            </button>
          </div>
        </div>
        <footer className="w-full pt-12 text-center text-sm text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} PagePulse – Automated SEO Audit Tool
        </footer>
      </main>
    </div>
  );
}
