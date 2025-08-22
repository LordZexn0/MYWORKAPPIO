"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AccountSettingsPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const r = await fetch('/api/admin/account', { cache: 'no-store' })
      if (r.ok) {
        const d = await r.json()
        setEmail(d.email)
        setUsername(d.username)
      }
    })()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (password && password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const csrf = await fetch('/api/auth/csrf', { method: 'GET', cache: 'no-store' }).then(r => r.json())
      const r = await fetch('/api/admin/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf.token },
        body: JSON.stringify({ email, username, password }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed to update account')
      setMessage('Account updated')
      setPassword('')
      setConfirm('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Update admin username, email, and password</CardDescription>
        </CardHeader>
        <CardContent>
          {message && <p className="text-sm text-green-600 mb-3">{message}</p>}
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password (optional)</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



