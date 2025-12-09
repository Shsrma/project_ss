"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Handle the typo in the backend redirect URL
export default function AvailablePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct available page
    router.replace("/available")
  }, [router])

  return null
}
