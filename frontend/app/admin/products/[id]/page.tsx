"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ProductViewById() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchProductById = async () => {
      try {
        // Fetch all products for a brand (or type)
        const res = await axios.get(
          "https://makeup-api.herokuapp.com/api/v1/products.json"
        )

        // Filter product by ID
        const found = res.data.find((p) => p.id.toString() === id.toString())

        setProduct(found || null)
      } catch (err) {
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductById()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Details</h2>
      <img
        src={product.image_link}
        alt={product.name}
        width={200}
        style={{ marginBottom: "10px" }}
      />
      <p><b>ID:</b> {product.id}</p>
      <p><b>Name:</b> {product.name}</p>
      <p><b>Brand:</b> {product.brand}</p>
      <p><b>Type:</b> {product.product_type}</p>
      <p><b>Price:</b> ${product.price}</p>
      <p><b>Description:</b> {product.description}</p>
    </div>
  )
}
