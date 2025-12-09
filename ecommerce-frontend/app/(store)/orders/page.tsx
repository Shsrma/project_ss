"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const updateOrderSchema = z.object({
  address: z.string().min(10, "Complete address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
})

type UpdateOrderForm = z.infer<typeof updateOrderSchema>

const getStatusColor = (status: string) => {
  switch (status) {
    case "order_placed":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-yellow-100 text-yellow-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateOrderForm>({
    resolver: zodResolver(updateOrderSchema),
  })

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await apiClient.get("/consumer/getallorders")
      if (response.ok) {
        const data = await response.json()
        return data.orders || data || []
      }
      return []
    },
  })

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: UpdateOrderForm }) => {
      const response = await apiClient.put(`/consumer/updateorder/${orderId}`, {
        shippingAddress: {
          street: data.address,
          phone: data.phone,
        },
      })
      if (!response.ok) throw new Error("Failed to update order")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast({
        title: "Order updated",
        description: "Your order has been updated successfully.",
      })
      setSelectedOrder(null)
      reset()
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      })
    },
  })

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.delete(`/consumer/cancleorder/${orderId}`)
      if (!response.ok) throw new Error("Failed to cancel order")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Cancellation failed",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  const handleUpdateOrder = (data: UpdateOrderForm) => {
    if (selectedOrder) {
      updateOrderMutation.mutate({ orderId: selectedOrder._id, data })
    }
  }

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate(orderId)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button variant="outline" onClick={() => router.push("/orders/details")}>
          View Details
        </Button>
      </div>

      {orders?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button onClick={() => router.push("/products")}>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order: Order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order._id.slice(-8)}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ").toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Items ({order.products.length})</h4>
                    <div className="space-y-1 text-sm">
                      {order.products.slice(0, 2).map((product, index) => (
                        <p key={index}>
                          Product ID: {product.productId} (Qty: {product.quantity})
                        </p>
                      ))}
                      {order.products.length > 2 && (
                        <p className="text-muted-foreground">+{order.products.length - 2} more items</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p>{order.shippingAddress.pincode}</p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-lg font-semibold">Total: {formatPrice(order.totalAmount)}</p>
                  </div>

                  <div className="flex space-x-2">
                    {order.status === "order_placed" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                reset({
                                  address: order.shippingAddress.street,
                                  phone: order.shippingAddress.phone,
                                })
                              }}
                            >
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Order</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleUpdateOrder)} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" {...register("address")} />
                                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" {...register("phone")} />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                              </div>

                              <Button type="submit" className="w-full" disabled={updateOrderMutation.isPending}>
                                {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancelOrderMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
