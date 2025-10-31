"use client"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
