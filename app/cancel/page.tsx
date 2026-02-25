export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-zinc-700 dark:text-zinc-200 mb-8">
        Oops, looks like you cancelled the checkout. No worries—you can try again anytime!
      </p>
      <a href="/pricing" className="bg-blue-600 px-6 py-3 rounded-xl text-white font-semibold transition hover:bg-blue-700 mt-6">Back to Pricing</a>
    </div>
  );
}
