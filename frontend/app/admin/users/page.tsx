'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Plus, RefreshCcw } from "lucide-react"

/* ================= DELETE USER ================= */

function DeleteDialog({ user, onDelete }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await axios.delete(`https://fakestoreapi.com/users/${user.id}`)
      toast.success("User deleted (mock)")
      onDelete(user.id)
      setOpen(false)
    } catch {
      toast.error("Delete failed")
    }
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
          <DialogTitle>Delete user?</DialogTitle>
        </DialogHeader>

        <DialogFooter>
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

/* ================= USER FORM ================= */

function UserForm({ user, close, onSave }) {
  const [form, setForm] = useState({
    firstname: user?.name?.firstname || "",
    lastname: user?.name?.lastname || "",
    email: user?.email || "",
    username: user?.username || "",
    password: "",
    phone: user?.phone || "",
    city: user?.address?.city || "",
    street: user?.address?.street || "",
    zipcode: user?.address?.zipcode || "",
    avatar1: user?.avatars?.[0] || "",
    avatar2: user?.avatars?.[1] || "",
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()

    const payload = {
      email: form.email,
      username: form.username,
      password: form.password || "123456",
      name: {
        firstname: form.firstname,
        lastname: form.lastname,
      },
      phone: form.phone,
      address: {
        city: form.city,
        street: form.street,
        zipcode: form.zipcode,
      },
      avatars: [form.avatar1, form.avatar2].filter(Boolean),
    }

    try {
      if (user) {
        await axios.put(
          `https://fakestoreapi.com/users/${user.id}`,
          payload
        )
        onSave({ ...user, ...payload }, "edit")
        toast.success("User updated (mock)")
      } else {
        const res = await axios.post(
          "https://fakestoreapi.com/users",
          payload
        )
        onSave(res.data, "add")
        toast.success("User added (mock)")
      }
      close(false)
    } catch {
      toast.error("Action failed")
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* BASIC INFO */}
      {["firstname", "lastname", "email", "username", "password", "phone"].map((f) => (
        <div key={f} className="grid gap-1">
          <Label>{f.toUpperCase()}</Label>
          <Input id={f} value={form[f]} onChange={handleChange} required />
        </div>
      ))}

      {/* ADDRESS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label>City</Label>
          <Input id="city" value={form.city} onChange={handleChange} />
        </div>
        <div>
          <Label>Street</Label>
          <Input id="street" value={form.street} onChange={handleChange} />
        </div>
        <div>
          <Label>Zip Code</Label>
          <Input id="zipcode" value={form.zipcode} onChange={handleChange} />
        </div>
      </div>

      {/* AVATARS */}
      <div>
        <Label>Avatar Image 1 (URL)</Label>
        <Input id="avatar1" value={form.avatar1} onChange={handleChange} />
      </div>

      <div>
        <Label>Avatar Image 2 (URL)</Label>
        <Input id="avatar2" value={form.avatar2} onChange={handleChange} />
      </div>

      {/* PREVIEW */}
      <div className="flex gap-3">
        {form.avatar1 && (
          <img src={form.avatar1} className="w-14 h-14 rounded-full" />
        )}
        {form.avatar2 && (
          <img src={form.avatar2} className="w-14 h-14 rounded-full" />
        )}
      </div>

      <Button className="rounded-full bg-pink-500 text-white">
        {user ? "Update User" : "Add User"}
      </Button>
    </form>
  )
}

/* ================= ADD / EDIT ================= */

function UserDialog({ user, onSave }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {user ? (
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Edit size={16} />
          </button>
        ) : (
          <Button className="rounded-full bg-pink-500 text-white">
            <Plus size={16} /> Add User
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? "Edit User" : "Add User"}
          </DialogTitle>
        </DialogHeader>

        <UserForm user={user} close={setOpen} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}

/* ================= USERS PAGE ================= */

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")

  const fetchUsers = async () => {
    const res = await fetch("https://fakestoreapi.com/users")
    setUsers(await res.json())
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = users.filter(
    (u) =>
      `${u.name.firstname} ${u.name.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDeleteUI = (id) =>
    setUsers((u) => u.filter((i) => i.id !== id))

  const handleSaveUI = (user, type) => {
    if (type === "add") setUsers((u) => [user, ...u])
    else
      setUsers((u) =>
        u.map((i) => (i.id === user.id ? user : i))
      )
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-rose-50 min-h-screen">
      {/* HEADER */}
      {/* PAGE TITLE */}
<div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-100 rounded-2xl shadow-md border border-pink-200">
  <h1 className="text-4xl font-extrabold text-pink-600 mb-2">
    Everglow Users
  </h1>
  <p className="text-gray-600 text-base">
    Manage customer profiles, contact details & avatars
  </p>
</div>

      <div className="flex justify-between mb-6">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-full"
        />

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers}>
            <RefreshCcw size={16} />
          </Button>
          <UserDialog onSave={handleSaveUI} />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="flex gap-3 items-center">
                  <img
                    src={u.avatars?.[0] || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">
                    {u.name.firstname} {u.name.lastname}
                  </span>
                </TableCell>

                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || "-"}</TableCell>
                <TableCell>{u.address?.city || "-"}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <UserDialog user={u} onSave={handleSaveUI} />
                    <DeleteDialog user={u} onDelete={handleDeleteUI} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
