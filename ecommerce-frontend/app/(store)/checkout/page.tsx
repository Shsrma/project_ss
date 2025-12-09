"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import Image from "next/image"

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(10, "Complete address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  })

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutForm) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const orderData = {
        products: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          size: item.size,
          price: Number.parseFloat(item.product.price),
        })),
        totalAmount: totalPrice,
        shippingAddress: {
          street: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.phone,
        },
      }

      const response = await apiClient.post("/consumer/placeorder", orderData)

      if (response.ok) {
        const result = await response.json()

        // If payment link is provided, open it
        if (result.payment_link) {
          window.open(result.payment_link, "_blank")
        }

        clearCart()
        toast({
          title: "Order placed successfully!",
          description: "You will receive a confirmation email shortly.",
        })
        router.push("/orders")
      } else {
        throw new Error("Failed to place order")
      }
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deliveryFee = totalPrice > 999 ? 0 : 99
  const finalTotal = totalPrice + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        disabled={isLoading}
                        className="bg-white border-gray-300"
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        disabled={isLoading}
                        className="bg-white border-gray-300"
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      disabled={isLoading}
                      className="bg-white border-gray-300"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700">
                      Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="Street address, apartment, suite, etc."
                      {...register("address")}
                      disabled={isLoading}
                      className="bg-white border-gray-300"
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        {...register("city")}
                        disabled={isLoading}
                        className="bg-white border-gray-300"
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-700">
                        State
                      </Label>
                      <Input
                        id="state"
                        {...register("state")}
                        disabled={isLoading}
                        className="bg-white border-gray-300"
                      />
                      {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-gray-700">
                        Pincode
                      </Label>
                      <Input
                        id="pincode"
                        {...register("pincode")}
                        disabled={isLoading}
                        className="bg-white border-gray-300"
                      />
                      {errors.pincode && <p className="text-sm text-red-500">{errors.pincode.message}</p>}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Placing Order..." : `Place Order - ${formatPrice(finalTotal)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.size}`} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="relative h-16 w-12 overflow-hidden rounded bg-white">
                        <Image
                          src={item.product.productImage || "/placeholder.svg?height=64&width=48"}
                          alt={item.product.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2 text-gray-800">{item.product.productName}</h4>
                        <p className="text-xs text-gray-600">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatPrice(Number.parseFloat(item.product.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-800">
                      {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {totalPrice < 999 && (
                  <p className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                    Add {formatPrice(999 - totalPrice)} more for free delivery
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
