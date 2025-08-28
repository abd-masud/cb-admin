import Link from "next/link";
import Head from "next/head";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Head>
        <title>Page Not Found | Lost but Not Alone</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist, but we'll help you find your way back."
        />
      </Head>

      <div className="text-center max-w-2xl space-y-6">
        <div className="animate-float">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-32 w-32 mx-auto"
            style={{ color: "#307DF1" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-[#307DF1]">
          Lost in the Digital Space
        </h2>

        <p className="text-lg text-gray-600">
          The page you&apos;re seeking has vanished into the digital ether.
          Perhaps it&apos;s exploring the cosmos of the internet, or maybe it
          never existed.
        </p>

        <p className="text-gray-500 italic">
          &quot;Not all those who wander are lost, but in this case, you might
          be.&quot;
        </p>

        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#307DF1] hover:bg-[#1a6bdf] border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Return to Home
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-400">
          <p>
            While you&apos;re here, why not take a deep breath? Inhale...
            Exhale...
          </p>
        </div>
      </div>
    </div>
  );
}
