import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-rose-600">
          Store Settings
        </h1>
        <p className="text-sm text-rose-400">
          Update your Everglow store configuration
        </p>
      </div>

      {/* General Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label htmlFor="storeName">Store Name</Label>
          <Input id="storeName" placeholder="Everglow" />

          <Label htmlFor="storeEmail">Email</Label>
          <Input id="storeEmail" type="email" placeholder="admin@everglow.com" />

          <Label htmlFor="storePhone">Phone</Label>
          <Input id="storePhone" type="tel" placeholder="+977 9812345678" />

          <Label htmlFor="storeAddress">Address</Label>
          <Input id="storeAddress" placeholder="Kathmandu, Nepal" />
        </div>

        {/* Branding / Colors */}
        <div className="space-y-4">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <Input id="primaryColor" type="color" defaultValue="#f43f5e" />

          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <Input id="secondaryColor" type="color" defaultValue="#fb7185" />

          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" placeholder="NPR" />

          <Label htmlFor="locale">Locale</Label>
          <Input id="locale" placeholder="en-NP" />
        </div>
      </div>

      {/* Save Button */}
      <div>
     <Button className="bg-rose-500 hover:bg-rose-600 text-white gap-2 cursor-pointer">
      Save Settings
    </Button>
     </div>
    </div>
  )
}
