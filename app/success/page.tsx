export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <h1 className="text-3xl font-bold text-green-500 mb-4">Payment Successful!</h1>
      <p className="text-lg text-zinc-700 dark:text-zinc-200 mb-8">
        Thank you for upgrading to <strong>Pro</strong>! Your account now has access to unlimited audits and advanced SEO reports.
      </p>
      <a href="/" className="bg-blue-600 px-6 py-3 rounded-xl text-white font-semibold transition hover:bg-blue-700 mt-6">Go Back to Homepage</a>
    </div>
  );
}
