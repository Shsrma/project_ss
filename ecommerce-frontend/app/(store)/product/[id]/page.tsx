"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"
import { ProductGrid } from "@/components/product-grid"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/lib/types"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import Image from "next/image"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState("")

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/consumer/products")

        if (response.status === 503) {
          // Backend not available, use mock data
          return mockProducts.find((p: Product) => p._id === params.id) || null
        }

        if (response.ok) {
          const data = await response.json()
          const products = data.products || data || []
          return products.find((p: Product) => p._id === params.id) || null
        }

        // Fallback to mock data
        return mockProducts.find((p: Product) => p._id === params.id) || null
      } catch (error) {
        console.error("Failed to fetch product:", error)
        // Return mock data on error
        return mockProducts.find((p: Product) => p._id === params.id) || null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ["products", "related", product?.category],
    queryFn: async () => {
      if (!product?.category) return []

      try {
        const response = await apiClient.get(`/consumer/products?category=${product.category}&limit=8`)

        if (response.status === 503) {
          // Use mock data
          return mockProducts
            .filter((p: Product) => p.category === product.category && p._id !== product._id)
            .slice(0, 4)
        }

        if (response.ok) {
          const data = await response.json()
          const products = data.products || data || []
          return products.filter((p: Product) => p._id !== product._id)
        }

        // Fallback
        return mockProducts.filter((p: Product) => p.category === product.category && p._id !== product._id).slice(0, 4)
      } catch (error) {
        console.error("Failed to fetch related products:", error)
        return mockProducts.filter((p: Product) => p.category === product.category && p._id !== product._id).slice(0, 4)
      }
    },
    enabled: !!product,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const isWishlisted = product ? isInWishlist(product._id) : false

  const handleAddToCart = () => {
    if (!product) return

    addItem(product, selectedSize, quantity)
    toast({
      title: "Added to cart",
      description: `${product.productName} has been added to your cart.`,
    })
  }

  const handleBuyNow = () => {
    if (!product) return

    addItem(product, selectedSize, quantity)
    // Redirect to checkout
    window.location.href = "/checkout"
  }

  const handleWishlist = () => {
    if (!product) return

    if (isWishlisted) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  const checkPincode = () => {
    if (pincode.length === 6) {
      toast({
        title: "Delivery available",
        description: `Delivery available to ${pincode}. Expected delivery in 3-5 days.`,
      })
    } else {
      toast({
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/products">Browse Products</a>
          </Button>
        </div>
      </div>
    )
  }

  const discountedPrice = product.discount ? calculateDiscount(product.price, product.discount) : null

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src={product.productImage || "/placeholder.svg?height=600&width=600"}
                alt={product.productName}
                fill
                className="object-cover"
                priority
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">{product.brand}</p>
              )}
              <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>

              {product.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews || 0} reviews)</span>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6">
                {discountedPrice ? (
                  <>
                    <span className="text-3xl font-bold">{formatPrice(discountedPrice)}</span>
                    <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    <Badge variant="destructive">{product.discount}% OFF</Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Size</h3>
              <ToggleGroup type="single" value={selectedSize} onValueChange={setSelectedSize} className="justify-start">
                {sizes.map((size) => (
                  <ToggleGroupItem key={size} value={size} className="w-12 h-12">
                    {size}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" onClick={handleWishlist} className="bg-white border-gray-300">
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-600"}`} />
                </Button>
              </div>
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            {/* Delivery Check */}
            <div className="space-y-3">
              <h3 className="font-semibold">Check Delivery</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="bg-white border-gray-300"
                />
                <Button variant="outline" onClick={checkPincode} className="bg-white border-gray-300">
                  Check
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-4 w-4 text-green-600" />
                <span>Free delivery on orders above ₹999</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                <span>Easy 30 days return & exchange</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>100% authentic products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p>{product.description || "No description available for this product."}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Product Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Brand</dt>
                      <dd>{product.brand || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd>{product.category || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Material</dt>
                      <dd>Cotton Blend</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Care</dt>
                      <dd>Machine Wash</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">{product.rating || 0}</div>
                  <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {product.reviews || 0} reviews</p>
                  </div>
                </div>
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}
