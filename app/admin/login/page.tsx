"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'password' | 'mfa' | 'otp'>('password')
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const csrf = await fetch('/api/auth/csrf', { method: 'GET', cache: 'no-store' }).then(r => r.json())
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf.token },
        body: JSON.stringify({ emailOrUsername, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      setStep('mfa')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const submitMfa = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const csrf = await fetch('/api/auth/csrf', { method: 'GET', cache: 'no-store' }).then(r => r.json())
      const res = await fetch('/api/auth/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf.token },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'MFA failed')
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MFA failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <Card className="rounded-none shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-900">Admin Login</CardTitle>
            <CardDescription>Secure access to CMS</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-sm text-red-600 mb-3" role="alert">{error}</p>
            )}

            {step === 'password' ? (
              <form onSubmit={submitPassword} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Email or Username</label>
                  <Input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="rounded-none bg-orange-500 hover:bg-orange-600 text-white w-full">{loading ? 'Checking...' : 'Continue'}</Button>
                  <Button type="button" variant="outline" className="rounded-none border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white" disabled={loading} onClick={async () => {
                    setError(null)
                    setLoading(true)
                    try {
                      const csrf = await fetch('/api/auth/csrf', { method: 'GET', cache: 'no-store' }).then(r => r.json())
                      const r = await fetch('/api/auth/otp/request', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf.token }, body: JSON.stringify({ destination: 'email' }) })
                      const d = await r.json()
                      if (!r.ok) throw new Error(d.error || 'Failed to request OTP')
                      if (d.code) setCode(d.code)
                      setStep('otp')
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'OTP request failed')
                    } finally {
                      setLoading(false)
                    }
                  }}>Use OTP</Button>
                </div>
              </form>
            ) : step === 'mfa' ? (
              <form onSubmit={submitMfa} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Authenticator Code</label>
                  <Input inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} required />
                </div>
                <Button type="submit" disabled={loading} className="rounded-none bg-orange-500 hover:bg-orange-600 text-white w-full">{loading ? 'Verifying...' : 'Verify & Continue'}</Button>
              </form>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)
                setError(null)
                try {
                  const csrf = await fetch('/api/auth/csrf', { method: 'GET', cache: 'no-store' }).then(r => r.json())
                  const r = await fetch('/api/auth/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf.token }, body: JSON.stringify({ code }) })
                  const d = await r.json()
                  if (!r.ok) throw new Error(d.error || 'OTP failed')
                  router.push('/admin')
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'OTP failed')
                } finally {
                  setLoading(false)
                }
              }} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">OTP Code (email)</label>
                  <Input inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} required />
                </div>
                <Button type="submit" disabled={loading} className="rounded-none bg-orange-500 hover:bg-orange-600 text-white w-full">{loading ? 'Verifying...' : 'Verify & Continue'}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


