"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductGrid } from "@/components/product-grid"
import { FiltersSheet } from "@/components/filters-sheet"
import { useFilters } from "@/hooks/use-filters"
import { apiClient } from "@/lib/api-client"
import { mockProducts } from "@/lib/mock-data"

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
]

export default function ProductsPage() {
  const { updateFilter, getFilter, searchParams } = useFilters()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("popularity")

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", searchParams.toString(), currentPage, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", currentPage.toString())
      params.set("sort", sortBy)

      const response = await apiClient.get(`/consumer/products?${params.toString()}`)

      // Check if backend is not available
      if (response.status === 503 || !response.ok) {
        console.log("Using filtered mock data - backend not available")

        // Apply basic filtering to mock data
        let filteredProducts = [...mockProducts]

        const category = getFilter("category")
        const search = getFilter("search")
        const brand = getFilter("brand")

        if (category) {
          const categories = category.split(",")
          filteredProducts = filteredProducts.filter((p) =>
            categories.some((cat) => p.category?.toLowerCase().includes(cat.toLowerCase())),
          )
        }

        if (search) {
          const searchLower = search.toLowerCase()
          filteredProducts = filteredProducts.filter(
            (p) =>
              p.productName.toLowerCase().includes(searchLower) ||
              p.brand?.toLowerCase().includes(searchLower) ||
              p.description?.toLowerCase().includes(searchLower),
          )
        }

        if (brand) {
          const brands = brand.split(",")
          filteredProducts = filteredProducts.filter((p) =>
            brands.some((b) => p.brand?.toLowerCase().includes(b.toLowerCase())),
          )
        }

        // Apply sorting
        if (sortBy === "price-low") {
          filteredProducts.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
        } else if (sortBy === "price-high") {
          filteredProducts.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
        } else if (sortBy === "newest") {
          filteredProducts.reverse() // Mock "newest first"
        }

        return {
          products: filteredProducts,
          totalPages: Math.ceil(filteredProducts.length / 12),
          currentPage: 1,
          isUsingMockData: true,
        }
      }

      try {
        const data = await response.json()
        return {
          products: data.products || data || [],
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || 1,
          isUsingMockData: false,
        }
      } catch (parseError) {
        console.warn("Failed to parse API response, using mock data")
        return {
          products: mockProducts,
          totalPages: 1,
          currentPage: 1,
          isUsingMockData: true,
        }
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const isUsingMockData = error || productsData?.isUsingMockData

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
            <p className="text-gray-600">{productsData?.products.length || 0} products found</p>
          </div>

          <div className="flex items-center space-x-4">
            <FiltersSheet />

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48 bg-white border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {isUsingMockData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Demo Mode:</strong> Backend not connected. Showing sample products with basic filtering.
              {process.env.NODE_ENV === "development" && (
                <span className="block mt-1">
                  Start your backend server at {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"} to see
                  real data.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Active Filters */}
        {searchParams.toString() && (
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-sm text-gray-600">Active filters:</span>
            {getFilter("category") && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilter("category", null)}
                className="bg-gray-100"
              >
                Category: {getFilter("category")} ×
              </Button>
            )}
            {getFilter("brand") && (
              <Button variant="secondary" size="sm" onClick={() => updateFilter("brand", null)} className="bg-gray-100">
                Brand: {getFilter("brand")} ×
              </Button>
            )}
            {getFilter("search") && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilter("search", null)}
                className="bg-gray-100"
              >
                Search: {getFilter("search")} ×
              </Button>
            )}
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid products={productsData?.products || []} isLoading={isLoading} className="mb-8" />

        {/* Load More */}
        {productsData && currentPage < productsData.totalPages && !isUsingMockData && (
          <div className="text-center">
            <Button onClick={handleLoadMore} variant="outline" size="lg" className="bg-white border-gray-300">
              Load More Products
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
