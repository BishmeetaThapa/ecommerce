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

export default function EverGlowForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
      
      <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-0">
        
        {/* Brand Header */}
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-xl">
            EG
          </div>

          <CardTitle className="text-2xl font-bold tracking-wide">
            Forgot Password?
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            No worries ✨ Enter your email and we’ll send you a reset link
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <form className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@everglow.com"
                className="h-11 rounded-xl"
                required
              />
            </div>
          </form>
        </CardContent>

        {/* Actions */}
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90">
            Send Reset Link
          </Button>

          <p className="text-sm text-muted-foreground text-center pt-2">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-pink-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}
