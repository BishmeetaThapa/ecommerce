'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "Bishmeeta Thapa",
    email: "bishmeeta@example.com",
    password: "",
    phone: "+977-9812345678",
    avatar: "https://via.placeholder.com/150",
    bio: "Hello! I am Bishmeeta, managing Everglow.",
    darkMode: false,
    notifications: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const handleToggle = (field: "darkMode" | "notifications") =>
    setForm({ ...form, [field]: !form[field] })

  const handleSave = () => {
    toast.success("Settings saved (mock)")
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
          onClick={() => toast("Reset settings (mock)")}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
