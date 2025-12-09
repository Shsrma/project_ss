"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedWishlist = localStorage.getItem("fashionkart-wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("fashionkart-wishlist", JSON.stringify(items))
  }, [items])

  const addToWishlist = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item._id === product._id)
      if (exists) {
        return prev
      }

      toast({
        title: "Added to wishlist",
        description: `${product.productName} has been added to your wishlist.`,
      })

      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => {
      const product = prev.find((item) => item._id === productId)
      if (product) {
        toast({
          title: "Removed from wishlist",
          description: `${product.productName} has been removed from your wishlist.`,
        })
      }
      return prev.filter((item) => item._id !== productId)
    })
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item._id === productId)
  }

  const clearWishlist = () => {
    setItems([])
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
