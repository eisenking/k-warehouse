"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getRequiredProducts } from "@/actions/tasks"
// import type { RequiredProduct } from "@/lib/types"

interface ProductsNeededProps {
  date: Date
}

export function ProductsNeeded({ date }: ProductsNeededProps) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const formattedDate = format(date, "yyyy-MM-dd")
        const productsData = await getRequiredProducts(formattedDate)
        setProducts(productsData)
      } catch (error) {
        console.error("Failed to fetch required products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [date])

  if (loading) {
    return <div className="flex justify-center p-4">Calculating required products...</div>
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No products needed for this date</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Required</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const isMissing = product.requiredQuantity > product.availableQuantity

          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell className="text-right">
                {product.requiredQuantity} {product.unit}
              </TableCell>
              <TableCell className="text-right">
                {product.availableQuantity} {product.unit}
              </TableCell>
              <TableCell className="text-right">
                {isMissing ? (
                  <Badge variant="destructive">
                    Missing {(product.requiredQuantity - product.availableQuantity).toFixed(2)} {product.unit}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50">
                    In Stock
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
