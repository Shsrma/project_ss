"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductGrid } from "@/components/product-grid"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { mockProducts } from "@/lib/mock-data"
import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Men", image: "/placeholder.svg?height=200&width=200&text=Men", href: "/products?category=men" },
  { name: "Women", image: "/placeholder.svg?height=200&width=200&text=Women", href: "/products?category=women" },
  { name: "Kids", image: "/placeholder.svg?height=200&width=200&text=Kids", href: "/products?category=kids" },
  { name: "Beauty", image: "/placeholder.svg?height=200&width=200&text=Beauty", href: "/products?category=beauty" },
  { name: "Home", image: "/placeholder.svg?height=200&width=200&text=Home", href: "/products?category=home" },
]

export default function HomePage() {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const response = await apiClient.get("/consumer/products?limit=12")

      // Check if backend is not available
      if (response.status === 503 || !response.ok) {
        console.log("Using mock data - backend not available")
        return mockProducts.slice(0, 8)
      }

      try {
        const data = await response.json()
        return data.products || data || mockProducts.slice(0, 8)
      } catch (parseError) {
        console.warn("Failed to parse API response, using mock data")
        return mockProducts.slice(0, 8)
      }
    },
    // Always return some data, even if stale
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry failed requests
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })

  const isUsingMockData = error || !products || products === mockProducts.slice(0, 8)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Fashion That Speaks</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover the latest trends and express your unique style
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>

        {/* Demo Mode Notice */}
        {isUsingMockData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Demo Mode:</strong> Backend not connected. Showing sample products.
              {process.env.NODE_ENV === "development" && (
                <span className="block mt-1">
                  Start your backend server at {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"} to see
                  real data.
                </span>
              )}
            </p>
          </div>
        )}

        <ProductGrid products={products || mockProducts.slice(0, 8)} isLoading={isLoading} />
      </section>

      {/* Promotional Banner */}
      <section className="bg-muted/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Get 20% Off Your First Order</h2>
          <p className="text-muted-foreground mb-6">Sign up for our newsletter and get exclusive deals and updates</p>
          <Button size="lg" asChild>
            <Link href="/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
