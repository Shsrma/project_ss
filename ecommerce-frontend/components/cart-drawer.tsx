"use client"

import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/logo"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  const deliveryFee = totalPrice > 999 ? 0 : 99
  const finalTotal = totalPrice + deliveryFee

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-white">
        <SheetHeader className="border-b pb-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo size="sm" showText={false} />
              <div>
                <SheetTitle className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Shopping Bag
                </SheetTitle>
                <p className="text-sm text-gray-600">{totalItems} items</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-0">
              {totalItems}
            </Badge>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-pink-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your bag is empty</h3>
                <p className="text-gray-600 text-sm mb-6">Discover amazing products and add them to your bag</p>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                asChild
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                <Link href="/products">
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 bg-white">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="group">
                    <div className="flex space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors bg-white border border-gray-100">
                      <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.product.productImage || "/placeholder.svg?height=80&width=64"}
                          alt={item.product.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold line-clamp-2 text-gray-800">
                            {item.product.productName}
                          </h4>
                          {item.product.brand && (
                            <p className="text-xs text-gray-500 font-medium">{item.product.brand}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                              Size: {item.size}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeItem(item.product._id, item.size)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-gray-800">
                            {formatPrice(Number.parseFloat(item.product.price) * item.quantity)}
                          </p>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full border-gray-300 hover:border-pink-300 hover:bg-pink-50 bg-white"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.size)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full border-gray-300 hover:border-pink-300 hover:bg-pink-50 bg-white"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.size)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4 bg-white">
              {/* Price Breakdown */}
              <div className="space-y-3 px-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-800">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {totalPrice < 999 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-800 font-medium text-center">
                    Add {formatPrice(999 - totalPrice)} more for FREE delivery! 🚚
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  asChild
                >
                  <Link href="/checkout" onClick={() => onOpenChange(false)}>
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50 font-medium bg-white"
                  asChild
                >
                  <Link href="/products" onClick={() => onOpenChange(false)}>
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
