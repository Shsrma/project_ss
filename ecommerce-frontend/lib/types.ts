export interface Product {
  _id: string
  productName: string
  price: string
  brand?: string
  category?: string
  description?: string
  productImage?: string
  sizes?: string[]
  colors?: string[]
  rating?: number
  reviews?: number
  discount?: number
  inStock?: boolean
}

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role?: "consumer" | "seller"
}

export interface Order {
  _id: string
  userId: string
  products: {
    productId: string
    quantity: number
    size: string
    price: number
  }[]
  totalAmount: number
  status: "order_placed" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
