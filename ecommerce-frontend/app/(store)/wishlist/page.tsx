"use client"

import type React from "react"

import { useState } from "react"
import { Heart, ShoppingBag, Trash2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, totalItems } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.productName} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeFromWishlist(productId)
  }

  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item._id))
    }
  }

  const handleRemoveSelected = () => {
    selectedItems.forEach((productId) => {
      removeFromWishlist(productId)
    })
    setSelectedItems([])
  }

  const handleAddSelectedToCart = () => {
    const selectedProducts = items.filter((item) => selectedItems.includes(item._id))
    selectedProducts.forEach((product) => {
      addItem(product)
    })
    toast({
      title: "Added to cart",
      description: `${selectedProducts.length} items have been added to your cart.`,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My FashionKart Wishlist",
          text: `Check out my wishlist with ${totalItems} amazing items!`,
          url: window.location.href,
        })
        toast({
          title: "Wishlist shared!",
          description: "Your wishlist has been successfully shared.",
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          // User cancelled share or permission denied (e.g., not over HTTPS, or in an iframe)
          navigator.clipboard.writeText(window.location.href)
          toast({
            title: "Share cancelled or not allowed",
            description: "Wishlist link copied to clipboard instead.",
          })
        } else {
          console.error("Error sharing wishlist:", error)
          toast({
            title: "Sharing failed",
            description: "Could not share wishlist. Link copied to clipboard.",
            variant: "destructive",
          })
          navigator.clipboard.writeText(window.location.href)
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Wishlist link has been copied to clipboard.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pink-100 rounded-full">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-gray-600">{totalItems} items saved</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleShare} className="bg-white border-gray-300">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {totalItems > 0 && (
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="bg-white border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-16 h-16 text-pink-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist. Review them anytime and easily move them to your bag.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === items.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Select All ({selectedItems.length} of {totalItems})
                  </span>
                </label>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSelectedToCart}
                    className="bg-white border-gray-300"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart ({selectedItems.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveSelected}
                    className="bg-white border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove ({selectedItems.length})
                  </Button>
                </div>
              )}
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => {
                const discountedPrice = product.discount ? calculateDiscount(product.price, product.discount) : null
                const isSelected = selectedItems.includes(product._id)

                return (
                  <Card
                    key={product._id}
                    className={`group overflow-hidden border-2 transition-all duration-200 ${
                      isSelected ? "border-pink-300 bg-pink-50" : "border-gray-200 bg-white hover:border-pink-200"
                    }`}
                  >
                    <div className="relative">
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(product._id)}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 bg-white shadow-sm"
                        />
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
                        onClick={(e) => handleRemoveFromWishlist(product._id, e)}
                      >
                        <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                      </Button>

                      <Link href={`/product/${product._id}`}>
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <Image
                            src={product.productImage || "/placeholder.svg?height=400&width=300"}
                            alt={product.productName}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />

                          {/* Discount Badge */}
                          {product.discount && (
                            <Badge className="absolute top-3 left-12 bg-red-500 hover:bg-red-600">
                              {product.discount}% OFF
                            </Badge>
                          )}

                          {/* Quick Add Button */}
                          <Button
                            size="sm"
                            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                            onClick={(e) => handleAddToCart(product, e)}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </Link>
                    </div>

                    <CardContent className="p-4">
                      <Link href={`/product/${product._id}`}>
                        <div className="space-y-2">
                          {product.brand && (
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{product.brand}</p>
                          )}
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-pink-600 transition-colors">
                            {product.productName}
                          </h3>

                          <div className="flex items-center space-x-2">
                            {discountedPrice ? (
                              <>
                                <span className="font-bold text-lg text-gray-800">{formatPrice(discountedPrice)}</span>
                                <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                              </>
                            ) : (
                              <span className="font-bold text-lg text-gray-800">{formatPrice(product.price)}</span>
                            )}
                          </div>

                          {product.rating && (
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${
                                      i < Math.floor(product.rating!) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Found something you like?</p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                  <Link href="/products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
