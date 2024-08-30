'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Separator } from './ui/separator'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { toast } = useToast()

  async function updatePassword() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password: password })
      if (error) throw error
      toast({
        title: "Success",
        description: "Password updated successfully!",
      })
      setPassword('') // Clear the password field after successful update
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating password!",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-max lg:w-[450px] md:w-[350px] border-0">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="text" value={user?.email ?? ''} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Change Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full"
          onClick={updatePassword}
          disabled={loading || !password}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
        <form action="/auth/signout" method="post" className="w-full">
          <Button type="submit" variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}