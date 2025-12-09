"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { CartItem, Product } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size?: string, quantity?: number) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("fashionkart-cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("fashionkart-cart", JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, size = "M", quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product._id === product._id && item.size === size)
      if (existingItem) {
        return prev.map((item) =>
          item.product._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { product, size, quantity }]
    })
  }

  const removeItem = (productId: string, size = "M") => {
    setItems((prev) => prev.filter((item) => !(item.product._id === productId && item.size === size)))
  }

  const updateQuantity = (productId: string, quantity: number, size = "M") => {
    if (quantity <= 0) {
      removeItem(productId, size)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.product._id === productId && item.size === size ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + Number.parseFloat(item.product.price) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
