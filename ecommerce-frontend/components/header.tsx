"use client"

import type React from "react"

import Link from "next/link"
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useAuth } from "@/context/auth-context"
import { CartDrawer } from "@/components/cart-drawer"
import { Logo } from "@/components/logo"
import { useState } from "react"
import { useRouter } from "next/navigation"

const categories = [
  { name: "Men", href: "/products?category=men" },
  { name: "Women", href: "/products?category=women" },
  { name: "Kids", href: "/products?category=kids" },
  { name: "Beauty", href: "/products?category=beauty" },
  { name: "Home", href: "/products?category=home" },
]

export function Header() {
  const { totalItems } = useCart()
  const { totalItems: wishlistItems } = useWishlist()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-gray-100 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-sm font-medium transition-colors hover:text-primary relative group"
              >
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands and more"
                className="pl-10 h-12 bg-white border-2 border-gray-200 focus-visible:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild className="relative group">
              <Link href="/wishlist">
                <Heart className="h-5 w-5 transition-colors group-hover:text-pink-500" />
                {wishlistItems > 0 && (
                  <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs bg-pink-500 border-0">
                    {wishlistItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative group" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-5 w-5 transition-colors group-hover:text-pink-500" />
              {totalItems > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-pink-500 to-orange-500 border-0">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild className="group">
                  <Link href="/orders">
                    <User className="h-5 w-5 transition-colors group-hover:text-pink-500" />
                  </Link>
                </Button>
                <Button variant="ghost" onClick={logout} className="hidden md:inline-flex hover:text-pink-500">
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="hidden md:inline-flex h-10 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 border-0"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Mobile Logo */}
                  <div className="flex justify-center mb-4">
                    <Logo size="lg" />
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10 bg-gray-50 border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50 rounded-md"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Wishlist */}
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50 rounded-md"
                  >
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </span>
                    {wishlistItems > 0 && <Badge className="bg-pink-500 text-white">{wishlistItems}</Badge>}
                  </Link>

                  {/* Mobile Auth */}
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link href="/orders">My Orders</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                          asChild
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button variant="outline" className="w-full bg-white border-gray-300" asChild>
                          <Link href="/register">Register</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  )
}
