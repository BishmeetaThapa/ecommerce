'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForeverYoungRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
      
      <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-0">
        
        {/* Brand Header */}
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-xl">
            FY
          </div>

          <CardTitle className="text-2xl font-bold tracking-wide">
            Create Account
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Join Forever Young & glow every day ✨
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <form className="space-y-5">

            {/* Full Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                type="text"
                placeholder="Your full name"
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@beauty.com"
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Create a password"
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm your password"
                className="h-11 rounded-xl"
                required
              />
            </div>

          </form>
        </CardContent>

        {/* Actions */}
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90">
            Sign Up
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 rounded-xl flex items-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </Button>

          <p className="text-sm text-muted-foreground text-center pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-600 font-semibold cursor-pointer hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}
