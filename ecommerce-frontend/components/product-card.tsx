"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isLoading, setIsLoading] = useState(false)

  const isWishlisted = isInWishlist(product._id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)

    try {
      addItem(product)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  const discountedPrice = product.discount ? calculateDiscount(product.price, product.discount) : null

  return (
    <Link href={`/product/${product._id}`}>
      <Card className="group overflow-hidden product-card-hover border-0 shadow-sm bg-white">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.productImage || "/placeholder.svg?height=400&width=300"}
            alt={product.productName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Discount Badge */}
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
            onClick={handleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-600"}`} />
          </Button>

          {/* Quick Add Button */}
          <Button
            size="sm"
            className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isLoading ? "Adding..." : "Quick Add"}
          </Button>
        </div>

        <CardContent className="p-3">
          <div className="space-y-1">
            {product.brand && <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>}
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.productName}
            </h3>

            <div className="flex items-center space-x-2">
              {discountedPrice ? (
                <>
                  <span className="font-semibold text-sm">{formatPrice(discountedPrice)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
              )}
            </div>

            {product.rating && (
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < Math.floor(product.rating!) ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews || 0})</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
