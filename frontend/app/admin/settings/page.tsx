'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import axios from "axios"

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    avatar: "",
    bio: "",
    darkMode: false,
    notifications: true,
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch current user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/users`

        // Try to get userId from localStorage first
        let userId = localStorage.getItem('userId')

        // If no userId in localStorage, get the first available user
        if (!userId) {
          const res = await axios.get(API_BASE)
          // Try to find admin first, then any user
          let user = res.data.find((u: any) => u.role === 'admin')
          if (!user) {
            user = res.data[0] // Get first user if no admin
          }
          if (user) {
            userId = user._id || user.id
            if (userId) localStorage.setItem('userId', userId)
          }
        }

        if (userId) {
          const res = await axios.get(`${API_BASE}/${userId}`)
          const user = res.data
          setForm({
            name: user.name || "",
            email: user.email || "",
            password: "",
            phone: user.phone || "",
            avatar: user.avatar || "",
            bio: user.bio || "",
            darkMode: user.darkMode || false,
            notifications: user.notifications !== false,
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const handleToggle = (field: "darkMode" | "notifications") =>
    setForm({ ...form, [field]: !form[field] })

  const handleSave = async () => {
    setSaving(true)
    try {
      const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/users`
      let userId = localStorage.getItem('userId')

      // If still no userId, get the first available user
      if (!userId) {
        const res = await axios.get(API_BASE)
        // Try to find admin first, then any user
        let user = res.data.find((u: any) => u.role === 'admin')
        if (!user) {
          user = res.data[0]
        }
        if (user) {
          userId = user._id || user.id
          if (userId) localStorage.setItem('userId', userId)
        }
      }

      if (!userId) {
        toast.error("No admin user found")
        setSaving(false)
        return
      }

      await axios.put(`${API_BASE}/${userId}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        darkMode: form.darkMode,
        notifications: form.notifications
      })

      // If password is provided, update it too
      if (form.password) {
        await axios.put(`${API_BASE}/${userId}/password`, {
          password: form.password
        })
        setForm({ ...form, password: "" })
      }

      toast.success("Settings saved successfully!")
    } catch (error: any) {
      console.error('Error saving settings:', error)
      toast.error(error.response?.data?.error || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-rose-100 min-h-screen rounded-3xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-pink-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-rose-100 min-h-screen rounded-3xl">
      {/* PAGE HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-2">Settings</h1>
        <p className="text-gray-600 text-lg">Update your account, profile, and preferences</p>
      </div>

      {/* ACCOUNT SETTINGS */}
      <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-pink-100 hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-pink-500">Account Settings</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <Label>Name</Label>
            <Input id="name" value={form.name} onChange={handleChange} className="mt-1" />
          </div>
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input id="email" type="email" value={form.email} onChange={handleChange} className="mt-1" />
          </div>
          <div className="flex flex-col">
            <Label>Password</Label>
            <Input id="password" type="password" value={form.password} onChange={handleChange} className="mt-1" />
          </div>
          <div className="flex flex-col">
            <Label>Phone</Label>
            <Input id="phone" value={form.phone} onChange={handleChange} className="mt-1" />
          </div>
        </div>
      </div>

      {/* PROFILE SETTINGS */}
      <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-pink-100 hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-pink-500">Profile Settings</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <Label>Avatar URL</Label>
            <Input id="avatar" value={form.avatar} onChange={handleChange} className="mt-1" />
          </div>
          <div className="flex justify-center items-center">
            {form.avatar && (
              <img
                src={form.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-pink-200 shadow-lg"
              />
            )}
          </div>
          <div className="flex flex-col md:col-span-2">
            <Label>Bio</Label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={handleChange}
              className="border rounded-2xl p-4 mt-1 resize-none focus:ring-2 focus:ring-pink-300"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* PREFERENCES */}
      <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-pink-100 hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-pink-500">Preferences</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex items-center gap-4">
            <Switch
              checked={form.darkMode}
              onCheckedChange={() => handleToggle("darkMode")}
            />
            <span className="font-medium text-gray-700">Dark Mode</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={form.notifications}
              onCheckedChange={() => handleToggle("notifications")}
            />
            <span className="font-medium text-gray-700">Notifications</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <Button
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full px-6 py-3 shadow-lg hover:scale-105 transition-transform duration-300"
          onClick={handleSave}
        >
          Save Changes
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-6 py-3 border-pink-400 text-pink-600 hover:bg-pink-50 hover:scale-105 transition-all duration-300"
          onClick={() => {
            setForm({
              name: "",
              email: "",
              password: "",
              phone: "",
              avatar: "",
              bio: "",
              darkMode: false,
              notifications: true,
            })
            toast.success("Settings reset")
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
