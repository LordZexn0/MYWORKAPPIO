"use client"

import { useEffect } from "react"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete()
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8">
          <img src="/images/logo-transparent.png" alt="MyWorkApp.io Logo" className="h-40 w-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-blue-900">MyWorkApp.io</h1>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-900 via-yellow-400 to-orange-500 animate-[progress_2s_ease-in-out]"></div>
        </div>
      </div>
    </div>
  )
}
