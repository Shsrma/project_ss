"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function AvailablePage() {
  const { checkAuth, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check auth status when landing on this page
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Redirect after successful auth check
    if (user) {
      const timer = setTimeout(() => {
        router.push("/orders")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Login Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Welcome back! You have been successfully logged in.</p>
          <p className="text-sm text-muted-foreground">Redirecting you to your orders...</p>
          <div className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/orders")}>
              Go to Orders
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
