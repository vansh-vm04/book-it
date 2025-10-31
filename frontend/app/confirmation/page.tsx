"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function Confirmation() {
  const router = useRouter();
  const params = useSearchParams();
  const refId = params.get("refId") || "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-32 bg-white font-sans">
      <div className="flex flex-col items-center mt-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="white"
            className="size-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-1">Booking Confirmed</h2>
        <p className="text-gray-500 text-xl mb-6">Ref ID: {refId}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
