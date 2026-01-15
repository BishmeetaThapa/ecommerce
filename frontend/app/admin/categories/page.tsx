'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Dialog, DialogContent,
  DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Plus } from "lucide-react"

/* ================= DELETE DIALOG ================= */
function DeleteDialog({ category, onDelete }: any) {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    toast.success("Category deleted (mock)")
    onDelete(category.id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-red-50 text-red-600">
          <Trash2 size={16} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete category?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} className="bg-red-600 text-white">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ================= CATEGORY FORM ================= */
function CategoryForm({ category, close, onSave }: any) {
  const [form, setForm] = useState({
    name: category?.name || "",
    image: category?.image || ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (category) {
      onSave({ ...category, ...form }, "edit")
      toast.success("Category updated (mock)")
    } else {
      onSave({ id: Date.now(), ...form }, "add")
      toast.success("Category added (mock)")
    }
    close(false)
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1">
        <Label>Name</Label>
        <Input id="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="grid gap-1">
        <Label>Image URL</Label>
        <Input id="image" value={form.image} onChange={handleChange} required />
      </div>

      {form.image && (
        <div className="flex justify-center mt-2">
          <img src={form.image} className="w-20 h-20 object-contain rounded-lg border" />
        </div>
      )}

      <Button className="rounded-full bg-pink-500 text-white">
        {category ? "Update Category" : "Add Category"}
      </Button>
    </form>
  )
}

/* ================= ADD / EDIT DIALOG ================= */
function CategoryDialog({ category, onSave }: any) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {category ? (
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Edit size={16} />
          </button>
        ) : (
          <Button className="rounded-full bg-pink-500 text-white flex items-center gap-2">
            <Plus size={16} /> Add Category
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>

        <CategoryForm category={category} close={setOpen} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}

/* ================= MAIN CATEGORIES PAGE ================= */
const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://api.escuelajs.co/api/v1/categories")
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error("Failed to fetch categories")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveUI = (cat: any, type: string) => {
    if (type === "add") setCategories((prev) => [cat, ...prev])
    else
      setCategories((prev) =>
        prev.map((i) => (i.id === cat.id ? cat : i))
      )
  }

  const handleDeleteUI = (id: number) =>
    setCategories((prev) => prev.filter((c) => c.id !== id))

  return (
    <div className="max-w-7xl mx-auto p-8 bg-rose-50 min-h-screen">
      {/* PAGE TITLE */}
      <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-100 rounded-2xl shadow-md border border-pink-200">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-2">
          Everglow Categories
        </h1>
        <p className="text-gray-600 text-base">
          Manage product categories, images & names
        </p>
      </div>

      {/* SEARCH & ADD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 rounded-full"
        />
        <CategoryDialog onSave={handleSaveUI} />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center gap-2">
            <img
              src={c.image || "https://via.placeholder.com/80"}
              className="w-24 h-24 object-contain rounded-lg"
            />
            <h3 className="font-bold text-lg text-pink-600 text-center">{c.name}</h3>
            <div className="flex gap-2 mt-2">
              <CategoryDialog category={c} onSave={handleSaveUI} />
              <DeleteDialog category={c} onDelete={handleDeleteUI} />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-10">
            No categories found
          </p>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage
