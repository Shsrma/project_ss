"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useFilters } from "@/hooks/use-filters"
import { useState } from "react"

const categories = ["Men", "Women", "Kids", "Beauty", "Home"]
const brands = ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Puma", "Levi's"]
const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Gray"]

export function FiltersSheet() {
  const { updateFilter, getFilter, clearFilters } = useFilters()
  const [priceRange, setPriceRange] = useState([0, 10000])

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = getFilter("category")?.split(",") || []
    let newCategories: string[]

    if (checked) {
      newCategories = [...currentCategories, category.toLowerCase()]
    } else {
      newCategories = currentCategories.filter((c) => c !== category.toLowerCase())
    }

    updateFilter("category", newCategories.length > 0 ? newCategories.join(",") : null)
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const currentBrands = getFilter("brand")?.split(",") || []
    let newBrands: string[]

    if (checked) {
      newBrands = [...currentBrands, brand.toLowerCase()]
    } else {
      newBrands = currentBrands.filter((b) => b !== brand.toLowerCase())
    }

    updateFilter("brand", newBrands.length > 0 ? newBrands.join(",") : null)
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    updateFilter("minPrice", value[0].toString())
    updateFilter("maxPrice", value[1].toString())
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filters
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <Accordion type="multiple" defaultValue={["category", "price", "brand"]}>
            {/* Categories */}
            <AccordionItem value="category">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={getFilter("category")?.split(",").includes(category.toLowerCase()) || false}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <label htmlFor={category} className="text-sm font-medium">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Range */}
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Brands */}
            <AccordionItem value="brand">
              <AccordionTrigger>Brands</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={getFilter("brand")?.split(",").includes(brand.toLowerCase()) || false}
                        onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                      />
                      <label htmlFor={brand} className="text-sm font-medium">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sizes */}
            <AccordionItem value="size">
              <AccordionTrigger>Sizes</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={getFilter("size")?.split(",").includes(size.toLowerCase()) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentSizes = getFilter("size")?.split(",") || []
                        const isSelected = currentSizes.includes(size.toLowerCase())
                        let newSizes: string[]

                        if (isSelected) {
                          newSizes = currentSizes.filter((s) => s !== size.toLowerCase())
                        } else {
                          newSizes = [...currentSizes, size.toLowerCase()]
                        }

                        updateFilter("size", newSizes.length > 0 ? newSizes.join(",") : null)
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Colors */}
            <AccordionItem value="color">
              <AccordionTrigger>Colors</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 ${
                        getFilter("color")?.split(",").includes(color.toLowerCase())
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => {
                        const currentColors = getFilter("color")?.split(",") || []
                        const isSelected = currentColors.includes(color.toLowerCase())
                        let newColors: string[]

                        if (isSelected) {
                          newColors = currentColors.filter((c) => c !== color.toLowerCase())
                        } else {
                          newColors = [...currentColors, color.toLowerCase()]
                        }

                        updateFilter("color", newColors.length > 0 ? newColors.join(",") : null)
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}
