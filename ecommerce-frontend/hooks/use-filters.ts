"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }

      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const getFilter = useCallback(
    (key: string) => {
      return searchParams.get(key)
    },
    [searchParams],
  )

  const clearFilters = useCallback(() => {
    router.push("/products")
  }, [router])

  return {
    updateFilter,
    getFilter,
    clearFilters,
    searchParams,
  }
}
