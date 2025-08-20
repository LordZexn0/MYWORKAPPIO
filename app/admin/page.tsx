"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { clearCMSCache } from "@/hooks/use-cms"
import { 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Home, 
  Settings, 
  FileText, 
  Users, 
  Phone, 
  Briefcase,
  Camera,
  Loader2,
  Check,
  X,
  Eye,
  Trash2,
  BarChart3,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

const sections = [
  { value: "site", label: "Site", icon: Settings },
  { value: "home", label: "Home", icon: Home },
  { value: "services", label: "Services", icon: Briefcase },
  { value: "cases", label: "Case Studies", icon: FileText },
  { value: "about", label: "Why Us", icon: Users },
  { value: "contact", label: "Contact", icon: Phone },
  { value: "blog", label: "Blog", icon: FileText },
]

function generateId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }
}

function assignIds(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => assignIds(item))
  }
  if (input && typeof input === "object") {
    const obj: any = { ...input }
    if (obj && typeof obj === "object" && !("id" in obj) && !("_id" in obj)) {
      obj._id = generateId()
    }
    for (const key of Object.keys(obj)) {
      obj[key] = assignIds(obj[key])
    }
    return obj
  }
  return input
}

function stripPrivateKeys(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => stripPrivateKeys(item))
  }
  if (input && typeof input === "object") {
    const obj: any = {}
    for (const [k, v] of Object.entries(input)) {
      if (k === "_id") continue
      obj[k] = stripPrivateKeys(v)
    }
    return obj
  }
  return input
}

interface CMSData {
  site?: {
    name?: string
    logo?: string
    logoTransparent?: string
    description?: string
    tagline?: string
    contact?: any
  }
  navigation?: {
    items?: any[]
    ctaButton?: string
  }
  home?: {
    hero?: {
      title?: string
      subtitle?: string
      description?: string
      primaryButton?: string
      secondaryButton?: string
    }
    stats?: any[]
    overview?: {
      title?: string
      description?: string
      services?: string[]
      buttonText?: string
    }
    cta?: {
      title?: string
      description?: string
      primaryButton?: string
      secondaryButton?: string
    }
  }
  services?: {
    hero?: any
    items?: any[]
    cta?: {
      title?: string
      description?: string
      primaryButton?: string
      secondaryButton?: string
    }
  }
  whyUs?: {
    hero?: any
    stats?: any[]
    reasons?: {
      title?: string
      description?: string
      items?: any[]
    }
    process?: {
      title?: string
      description?: string
      steps?: any[]
    }
    cta?: {
      title?: string
      description?: string
      primaryButton?: string
      secondaryButton?: string
    }
  }
  caseStudies?: {
    hero?: any
    items?: any[]
    stats?: {
      title?: string
      items?: any[]
    }
    cta?: {
      title?: string
      description?: string
      primaryButton?: string
      secondaryButton?: string
    }
  }
  blog?: {
    hero?: any
    posts?: any[]
    newsletter?: {
      title?: string
      description?: string
      buttonText?: string
    }
  }
  contact?: {
    hero?: any
    info?: any[]
    form?: {
      title?: string
      fields?: any
      submitButton?: string
      submittingText?: string
      successTitle?: string
      successMessage?: string
      successButton?: string
    }
  }
  footer?: {
    description?: string
    quickLinks?: {
      items?: any[]
    }
    contact?: {
      items?: string[]
    }
    legal?: any[]
    copyright?: string
  }
  supplyChain?: {
    title?: string
    description?: string
    steps?: any[]
    conclusion?: string
  }
  [key: string]: any
}

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (url: string) => void
  label: string
  description?: string
  aspectRatio?: string
  }

function ImageUpload({ currentImage, onImageChange, label, description, aspectRatio = "aspect-video" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        onImageChange(result.url)
        toast({
          title: "✅ Image Uploaded",
          description: "Image has been uploaded successfully",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "❌ Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {currentImage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onImageChange("")}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
        } ${currentImage ? "border-green-300 bg-green-50" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
      >
        {currentImage ? (
          <div className="space-y-3">
            <div className={`relative ${aspectRatio} w-full overflow-hidden rounded-md bg-gray-100`}>
              <Image
                src={currentImage}
                alt={label}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-green-700 bg-green-100">
                <Check className="h-3 w-3 mr-1" />
                Image Set
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentImage, '_blank')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG, WebP, GIF (max 5MB)
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ConfirmButton({
  children,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  onConfirm,
}: {
  children: React.ReactNode
  title?: string
  description?: string
  confirmText?: string
  onConfirm: () => void | Promise<void>
}) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                await onConfirm()
              } finally {
                setOpen(false)
              }
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface TagEditorProps {
  tags: string[]
  onChange: (next: string[]) => void
  suggestions?: string[]
  label?: string
  placeholder?: string
}

function TagEditor({ tags, onChange, suggestions = [], label = "Tags", placeholder = "Add a tag and press Enter" }: TagEditorProps) {
  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)

  const normalized = (t: string) => t.trim().replace(/\s+/g, " ")

  const addTag = (raw: string) => {
    const t = normalized(raw)
    if (!t) return
    const exists = tags.some((x) => x.toLowerCase() === t.toLowerCase())
    if (exists) {
      setInput("")
      return
    }
    onChange([...tags, t])
    setInput("")
  }

  const removeTag = (index: number) => {
    const next = [...tags]
    next.splice(index, 1)
    onChange(next)
  }

  const filteredSuggestions = suggestions
    .filter(Boolean)
    .filter((s) => s.toLowerCase().includes(input.toLowerCase()))
    .filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
    .slice(0, 8)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Edit"}
        </Button>
      </div>

      {/* Collapsed summary */}
      {!open && (
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <span key={`${idx}-${tag}`} className="bg-gray-100 px-2 py-1 text-sm">{tag}</span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No tags</span>
          )}
        </div>
      )}

      {/* Editor */}
      {open && (
        <>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <div key={`${idx}-${tag}`} className="flex items-center gap-1 bg-gray-100 px-2 py-1 text-sm">
                <span>{tag}</span>
                <ConfirmButton
                  title="Remove tag?"
                  description="This will remove the tag from this item."
                  confirmText="Remove"
                  onConfirm={() => removeTag(idx)}
                >
                  <Button type="button" variant="ghost" size="sm" className="text-red-500">
                    <X className="h-3 w-3" />
                  </Button>
                </ConfirmButton>
              </div>
            ))}
          </div>

          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addTag(input)
                }
                if (e.key === 'Backspace' && !input && tags.length > 0) {
                  removeTag(tags.length - 1)
                }
              }}
              placeholder={placeholder}
            />
            {input.trim().length > 0 && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full border bg-white shadow">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="block w-full text-left px-3 py-2 hover:bg-gray-50"
                    onClick={() => addTag(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [data, setData] = useState<CMSData | null>(null)
  const [originalData, setOriginalData] = useState<CMSData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [activeTab, setActiveTab] = useState("site")
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const [sectionQuery, setSectionQuery] = useState("")
  const [caseItemExpanded, setCaseItemExpanded] = useState<Record<string | number, boolean>>({})
  const [caseExpandAll, setCaseExpandAll] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cms")
      if (!response.ok) throw new Error('Failed to fetch CMS data')
      const result = await response.json()
      const withIds = assignIds(result)
      setOriginalData(withIds)
      setData(withIds)
      setDirty(false)
    } catch (error) {
      console.error('Error fetching CMS data:', error)
      toast({
        title: "Error Loading Content",
        description: "There was a problem loading the CMS content. Some features may be limited.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = useCallback(async (options?: { silent?: boolean }) => {
    if (!data) return

    try {
      setSaving(true)
      const response = await fetch("/api/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stripPrivateKeys(data)),
      })

      const result = await response.json()

      if (result.success) {
        // Clear the CMS cache so fresh data is loaded
        clearCMSCache()
        // Refresh data and reset dirty state
        await fetchData()
        setDirty(false)
        setLastSavedAt(Date.now())
        if (!options?.silent) {
          toast({
            title: "✅ Changes Saved",
            description: result.storage === "kv" 
              ? "Your changes have been saved to cloud storage successfully."
              : result.storage === "file"
              ? "Your changes have been saved to local file storage."
              : "Changes processed, but persistent storage is currently unavailable.",
          })
        }
      } else {
        throw new Error(result.error || 'Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving CMS data:', error)
      toast({
        title: "Error Saving Changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }, [data, toast])

  // Warn if navigating away with unsaved changes
  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", beforeUnloadHandler)
    return () => window.removeEventListener("beforeunload", beforeUnloadHandler)
  }, [dirty])

  // Keyboard shortcut: Ctrl/Cmd + S to save
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s"
      if (isSave) {
        e.preventDefault()
        if (dirty && !saving) {
          void handleSave()
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dirty, saving, handleSave])

  // Removed autosave on inactivity per request

  const updateData = (path: string[], value: any) => {
    if (!data) return

    const newData = { ...data }
    let current: any = newData

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {}
      }
      current = current[path[i]]
    }

    const key = path[path.length - 1]
    // If input was cleared to empty string, store empty string (avoid fallback values)
    if (typeof value === 'string' && value === '') {
      current[key] = ''
    } else {
      current[key] = value
    }
    setData(newData)
    setDirty(true)
  }

  function getValueAtPath(obj: any, path: string[]): any {
    try {
      return path.reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj)
    } catch {
      return undefined
    }
  }

  function Prev({ path }: { path: string[] }) {
    if (!originalData) return null
    const prev = getValueAtPath(originalData, path)
    if (prev === undefined || prev === null || prev === "") return null
    return (
      <div className="mt-1 text-xs text-gray-500">Previous: {String(prev)}</div>
    )
  }

  function reorderArrayAtPath(path: string[], fromIndex: number, toIndex: number) {
    if (!data) return
    const parentPath = path.slice(0, -1)
    const arrayKey = path[path.length - 1]
    let parent: any = data
    for (const key of parentPath) {
      if (!parent[key]) parent[key] = {}
      parent = parent[key]
    }
    const arr: any[] = Array.isArray(parent[arrayKey]) ? [...parent[arrayKey]] : []
    if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) return
    const [moved] = arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, moved)
    updateData(path, arr)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading CMS...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">❌ Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Failed to load CMS data</p>
            <Button onClick={fetchData} className="w-full">
              Try Again
          </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Content Management System</h1>
              </div>
              <Badge variant="secondary">MyWorkApp.io</Badge>
              {saving ? (
                <Badge variant="secondary">Saving…</Badge>
              ) : dirty ? (
                <Badge variant="destructive">Unsaved changes</Badge>
              ) : (
                <Badge variant="outline">Saved{lastSavedAt ? ` at ${new Date(lastSavedAt).toLocaleTimeString()}` : ""}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!dirty || !originalData) return
                  const confirmed = window.confirm("Discard all unsaved changes?")
                  if (confirmed) {
                    setData(originalData)
                    setDirty(false)
                    toast({ title: "Changes discarded", description: "Your edits have been reverted." })
                  }
                }}
                disabled={!dirty || saving}
              >
                <X className="h-4 w-4 mr-2" />
                Discard
              </Button>
              <Button
                onClick={() => handleSave()}
                disabled={saving || !dirty}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input
                    placeholder="Filter sections..."
                    value={sectionQuery}
                    onChange={(e) => setSectionQuery(e.target.value)}
                  />
                  <div className="space-y-2">
                    {(sections.filter(s => s.label.toLowerCase().includes(sectionQuery.toLowerCase()))).map((s) => {
                      const Icon = s.icon
                      const isActive = activeTab === s.value
                      return (
                        <Button
                          key={s.value}
                          type="button"
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setActiveTab(s.value)}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {s.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-7 lg:hidden">
            <TabsTrigger value="site" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Site</span>
            </TabsTrigger>
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Cases</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
              </TabsList>

          {/* Site Settings Tab */}
          <TabsContent value="site" className="space-y-6">
            {/* Site Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Site Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={data.site?.name || ""}
                        onChange={(e) => updateData(["site", "name"], e.target.value)}
                        placeholder="MyWorkApp.io"
                      />
                      <Prev path={["site", "name"]} />
                    </div>
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={data.site?.tagline || ""}
                        onChange={(e) => updateData(["site", "tagline"], e.target.value)}
                        placeholder="Modern Solutions For Tomorrow's Challenges"
                      />
                      <Prev path={["site", "tagline"]} />
                    </div>
                    <div>
                      <Label htmlFor="description">Site Description</Label>
                      <Textarea
                        id="description"
                        value={data.site?.description || ""}
                        onChange={(e) => updateData(["site", "description"], e.target.value)}
                        placeholder="End-to-end turnkey solutions for logistics..."
                        rows={4}
                      />
                      <Prev path={["site", "description"]} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <ImageUpload
                      currentImage={data.site?.logo}
                      onImageChange={(url) => updateData(["site", "logo"], url)}
                      label="Main Logo"
                      description="Used in navigation and headers (recommended: 200x50px)"
                      aspectRatio="aspect-[4/1]"
                    />
                    <ImageUpload
                      currentImage={data.site?.logoTransparent}
                      onImageChange={(url) => updateData(["site", "logoTransparent"], url)}
                      label="Transparent Logo"
                      description="Used on dark backgrounds and loading screen"
                      aspectRatio="aspect-square"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Navigation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="navCTAButton">Navigation CTA Button Text</Label>
                  <Input
                    id="navCTAButton"
                    value={data.navigation?.ctaButton || ""}
                    onChange={(e) => updateData(["navigation", "ctaButton"], e.target.value)}
                    placeholder="Get Started"
                  />
                  <Prev path={["navigation", "ctaButton"]} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Navigation Items</h3>
                  {(data.navigation?.items || []).map((item: any, index: number) => (
                    <div key={item?._id || index} className="flex gap-2 items-start">
                      <Input
                        value={item.href || ""}
                        onChange={(e) => {
                          const newItems = [...(data.navigation?.items || [])];
                          newItems[index] = { ...item, href: e.target.value };
                          updateData(["navigation", "items"], newItems);
                        }}
                        placeholder="/services"
                      />
                      <Prev path={["navigation", "items", String(index), "href"]} />
                      <Input
                        value={item.label || ""}
                        onChange={(e) => {
                          const newItems = [...(data.navigation?.items || [])];
                          newItems[index] = { ...item, label: e.target.value };
                          updateData(["navigation", "items"], newItems);
                        }}
                        placeholder="Services"
                      />
                      <Prev path={["navigation", "items", String(index), "label"]} />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["navigation", "items"], index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["navigation", "items"], index, Math.min((data.navigation?.items?.length || 1) - 1, index + 1))}
                          disabled={index === (data.navigation?.items?.length || 1) - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <ConfirmButton
                          title="Remove navigation item?"
                          description="This will permanently remove the navigation link."
                          confirmText="Remove"
                          onConfirm={() => {
                            const newItems = [...(data.navigation?.items || [])]
                            newItems.splice(index, 1)
                            updateData(["navigation", "items"], newItems)
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </ConfirmButton>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(data.navigation?.items || []), { _id: generateId(), href: "", label: "" }];
                      updateData(["navigation", "items"], newItems);
                    }}
                  >
                    Add Navigation Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Footer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="footerDescription">Footer Description</Label>
                  <Textarea
                    id="footerDescription"
                    value={data.footer?.description || ""}
                    onChange={(e) => updateData(["footer", "description"], e.target.value)}
                    placeholder="Transforming operations with turnkey solutions..."
                    rows={3}
                  />
                  <Prev path={["footer", "description"]} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quick Links</h3>
                  {(data.footer?.quickLinks?.items || []).map((link: any, index: number) => (
                    <div key={link?._id || index} className="flex gap-2 items-start">
                      <Input
                        value={link.href || ""}
                        onChange={(e) => {
                          const newItems = [...(data.footer?.quickLinks?.items || [])];
                          newItems[index] = { ...link, href: e.target.value };
                          updateData(["footer", "quickLinks", "items"], newItems);
                        }}
                        placeholder="/services"
                      />
                      <Prev path={["footer", "quickLinks", "items", String(index), "href"]} />
                      <Input
                        value={link.label || ""}
                        onChange={(e) => {
                          const newItems = [...(data.footer?.quickLinks?.items || [])];
                          newItems[index] = { ...link, label: e.target.value };
                          updateData(["footer", "quickLinks", "items"], newItems);
                        }}
                        placeholder="Services"
                      />
                      <Prev path={["footer", "quickLinks", "items", String(index), "label"]} />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["footer", "quickLinks", "items"], index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["footer", "quickLinks", "items"], index, Math.min((data.footer?.quickLinks?.items?.length || 1) - 1, index + 1))}
                          disabled={index === (data.footer?.quickLinks?.items?.length || 1) - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <ConfirmButton
                          title="Remove quick link?"
                          description="This will permanently remove the link from the footer."
                          confirmText="Remove"
                          onConfirm={() => {
                            const newItems = [...(data.footer?.quickLinks?.items || [])]
                            newItems.splice(index, 1)
                            updateData(["footer", "quickLinks", "items"], newItems)
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </ConfirmButton>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(data.footer?.quickLinks?.items || []), { _id: generateId(), href: "", label: "" }];
                      updateData(["footer", "quickLinks", "items"], newItems);
                    }}
                  >
                    Add Quick Link
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  {(data.footer?.contact?.items || []).map((item: string, index: number) => (
                    <div key={`${index}-${item ?? ''}`} className="flex gap-2">
                      <Input
                        value={item || ""}
                        onChange={(e) => {
                          const newItems = [...(data.footer?.contact?.items || [])];
                          newItems[index] = e.target.value;
                          updateData(["footer", "contact", "items"], newItems);
                        }}
                        placeholder="Contact information"
                      />
                      <Prev path={["footer", "contact", "items", String(index)]} />
                      <ConfirmButton
                        title="Remove contact item?"
                        description="This will permanently remove the contact item."
                        confirmText="Remove"
                        onConfirm={() => {
                          const newItems = [...(data.footer?.contact?.items || [])]
                          newItems.splice(index, 1)
                          updateData(["footer", "contact", "items"], newItems)
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </ConfirmButton>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(data.footer?.contact?.items || []), ""];
                      updateData(["footer", "contact", "items"], newItems);
                    }}
                  >
                    Add Contact Item
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Legal Links</h3>
                  {(data.footer?.legal || []).map((link: any, index: number) => (
                    <div key={link?._id || index} className="flex gap-2 items-start">
                      <Input
                        value={link.href || ""}
                        onChange={(e) => {
                          const newLegal = [...(data.footer?.legal || [])];
                          newLegal[index] = { ...link, href: e.target.value };
                          updateData(["footer", "legal"], newLegal);
                        }}
                        placeholder="/privacy"
                      />
                      <Prev path={["footer", "legal", String(index), "href"]} />
                      <Input
                        value={link.label || ""}
                        onChange={(e) => {
                          const newLegal = [...(data.footer?.legal || [])];
                          newLegal[index] = { ...link, label: e.target.value };
                          updateData(["footer", "legal"], newLegal);
                        }}
                        placeholder="Privacy Policy"
                      />
                      <Prev path={["footer", "legal", String(index), "label"]} />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["footer", "legal"], index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["footer", "legal"], index, Math.min((data.footer?.legal?.length || 1) - 1, index + 1))}
                          disabled={index === (data.footer?.legal?.length || 1) - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <ConfirmButton
                          title="Remove legal link?"
                          description="This will permanently remove the legal link."
                          confirmText="Remove"
                          onConfirm={() => {
                            const newLegal = [...(data.footer?.legal || [])]
                            newLegal.splice(index, 1)
                            updateData(["footer", "legal"], newLegal)
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </ConfirmButton>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newLegal = [...(data.footer?.legal || []), { _id: generateId(), href: "", label: "" }];
                      updateData(["footer", "legal"], newLegal);
                    }}
                  >
                    Add Legal Link
                  </Button>
                </div>

                <div>
                  <Label htmlFor="copyright">Copyright Text</Label>
                  <Input
                    id="copyright"
                    value={data.footer?.copyright || ""}
                    onChange={(e) => updateData(["footer", "copyright"], e.target.value)}
                    placeholder="© {year} MyWorkApp.io. All rights reserved."
                  />
                  <Prev path={["footer", "copyright"]} />
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Animation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Supply Chain Animation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="supplyChainTitle">Title</Label>
                    <Input
                      id="supplyChainTitle"
                      value={data.supplyChain?.title || ""}
                      onChange={(e) => updateData(["supplyChain", "title"], e.target.value)}
                      placeholder="Our End-to-End Supply Chain Solution"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplyChainDescription">Description</Label>
                    <Textarea
                      id="supplyChainDescription"
                      value={data.supplyChain?.description || ""}
                      onChange={(e) => updateData(["supplyChain", "description"], e.target.value)}
                      placeholder="From warehouse to delivery..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplyChainConclusion">Conclusion</Label>
                    <Input
                      id="supplyChainConclusion"
                      value={data.supplyChain?.conclusion || ""}
                      onChange={(e) => updateData(["supplyChain", "conclusion"], e.target.value)}
                      placeholder="Our integrated platform connects every step..."
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Supply Chain Steps</h3>
                  {(data.supplyChain?.steps || []).map((step: any, index: number) => (
                    <Card key={step?._id || index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-base">Step {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Icon Name</Label>
                            <Input
                              value={step.icon || ""}
                              onChange={(e) => {
                                const newSteps = [...(data.supplyChain?.steps || [])];
                                newSteps[index] = { ...step, icon: e.target.value };
                                updateData(["supplyChain", "steps"], newSteps);
                              }}
                              placeholder="Warehouse"
                            />
                          </div>
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={step.title || ""}
                              onChange={(e) => {
                                const newSteps = [...(data.supplyChain?.steps || [])];
                                newSteps[index] = { ...step, title: e.target.value };
                                updateData(["supplyChain", "steps"], newSteps);
                              }}
                              placeholder="Warehouse"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={step.description || ""}
                              onChange={(e) => {
                                const newSteps = [...(data.supplyChain?.steps || [])];
                                newSteps[index] = { ...step, description: e.target.value };
                                updateData(["supplyChain", "steps"], newSteps);
                              }}
                              placeholder="Inventory tracking and management"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Color Class</Label>
                          <Input
                            value={step.color || ""}
                            onChange={(e) => {
                              const newSteps = [...(data.supplyChain?.steps || [])];
                              newSteps[index] = { ...step, color: e.target.value };
                              updateData(["supplyChain", "steps"], newSteps);
                            }}
                            placeholder="text-[#0F4C81]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["supplyChain", "steps"], index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["supplyChain", "steps"], index, Math.min((data.supplyChain?.steps?.length || 1) - 1, index + 1))}
                            disabled={index === (data.supplyChain?.steps?.length || 1) - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Hero Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={data.home?.hero?.title || ""}
                    onChange={(e) => updateData(["home", "hero", "title"], e.target.value)}
                    placeholder="Transform Your Operations with Turnkey Solutions"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={data.home?.hero?.subtitle || ""}
                    onChange={(e) => updateData(["home", "hero", "subtitle"], e.target.value)}
                    placeholder="Ready-to-Deploy Systems That Work From Day One"
                  />
                </div>
                <div>
                  <Label htmlFor="heroDescription">Hero Description</Label>
                  <Textarea
                    id="heroDescription"
                    value={data.home?.hero?.description || ""}
                    onChange={(e) => updateData(["home", "hero", "description"], e.target.value)}
                    placeholder="We deliver complete, turnkey solutions..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryButton">Primary Button Text</Label>
                    <Input
                      id="primaryButton"
                      value={data.home?.hero?.primaryButton || ""}
                      onChange={(e) => updateData(["home", "hero", "primaryButton"], e.target.value)}
                      placeholder="Get Started Today"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryButton">Secondary Button Text</Label>
                    <Input
                      id="secondaryButton"
                      value={data.home?.hero?.secondaryButton || ""}
                      onChange={(e) => updateData(["home", "hero", "secondaryButton"], e.target.value)}
                      placeholder="View Our Services"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Stats Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(data.home?.stats || []).map((stat: any, index: number) => (
                    <div key={stat?._id || index} className="space-y-2">
                      <Label>Stat {index + 1}</Label>
                      <div className="space-y-2">
                        <Input
                          value={stat.number || ""}
                          onChange={(e) => {
                            const newStats = [...(data.home?.stats || [])];
                            newStats[index] = { ...stat, number: e.target.value };
                            updateData(["home", "stats"], newStats);
                          }}
                          placeholder="500+"
                        />
                        <Input
                          value={stat.label || ""}
                          onChange={(e) => {
                            const newStats = [...(data.home?.stats || [])];
                            newStats[index] = { ...stat, label: e.target.value };
                            updateData(["home", "stats"], newStats);
                          }}
                          placeholder="Projects Completed"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["home", "stats"], index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["home", "stats"], index, Math.min((data.home?.stats?.length || 1) - 1, index + 1))}
                          disabled={index === (data.home?.stats?.length || 1) - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Overview Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Overview Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="overviewTitle">Overview Title</Label>
                  <Input
                    id="overviewTitle"
                    value={data.home?.overview?.title || ""}
                    onChange={(e) => updateData(["home", "overview", "title"], e.target.value)}
                    placeholder="Turnkey Solutions That Work"
                  />
                </div>
                <div>
                  <Label htmlFor="overviewDescription">Overview Description</Label>
                  <Textarea
                    id="overviewDescription"
                    value={data.home?.overview?.description || ""}
                    onChange={(e) => updateData(["home", "overview", "description"], e.target.value)}
                    placeholder="We deliver complete, ready-to-use systems..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Services List</Label>
                  <div className="space-y-2">
                    {(data.home?.overview?.services || []).map((service: string, index: number) => (
                      <div key={`${index}-${service ?? ''}`} className="flex gap-2 items-center">
                        <Input
                          value={service || ""}
                          onChange={(e) => {
                            const newServices = [...(data.home?.overview?.services || [])];
                            newServices[index] = e.target.value;
                            updateData(["home", "overview", "services"], newServices);
                          }}
                          placeholder="Service name"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["home", "overview", "services"], index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["home", "overview", "services"], index, Math.min((data.home?.overview?.services?.length || 1) - 1, index + 1))}
                          disabled={index === (data.home?.overview?.services?.length || 1) - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newServices = [...(data.home?.overview?.services || [])];
                            newServices.splice(index, 1);
                            updateData(["home", "overview", "services"], newServices);
                          }}
                          className="text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newServices = [...(data.home?.overview?.services || []), ""];
                        updateData(["home", "overview", "services"], newServices);
                      }}
                    >
                      Add Service
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="overviewButton">Overview Button Text</Label>
                  <Input
                    id="overviewButton"
                    value={data.home?.overview?.buttonText || ""}
                    onChange={(e) => updateData(["home", "overview", "buttonText"], e.target.value)}
                    placeholder="Learn More About Our Services"
                  />
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRight className="h-5 w-5" />
                  <span>Call to Action Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ctaTitle">CTA Title</Label>
                  <Input
                    id="ctaTitle"
                    value={data.home?.cta?.title || ""}
                    onChange={(e) => updateData(["home", "cta", "title"], e.target.value)}
                    placeholder="Ready to Transform Your Operations?"
                  />
                </div>
                <div>
                  <Label htmlFor="ctaDescription">CTA Description</Label>
                  <Textarea
                    id="ctaDescription"
                    value={data.home?.cta?.description || ""}
                    onChange={(e) => updateData(["home", "cta", "description"], e.target.value)}
                    placeholder="Get started with a free consultation..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ctaPrimaryButton">Primary Button Text</Label>
                    <Input
                      id="ctaPrimaryButton"
                      value={data.home?.cta?.primaryButton || ""}
                      onChange={(e) => updateData(["home", "cta", "primaryButton"], e.target.value)}
                      placeholder="Get Free Consultation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaSecondaryButton">Secondary Button Text</Label>
                    <Input
                      id="ctaSecondaryButton"
                      value={data.home?.cta?.secondaryButton || ""}
                      onChange={(e) => updateData(["home", "cta", "secondaryButton"], e.target.value)}
                      placeholder="Why Choose Us"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Services Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="servicesTitle">Services Page Title</Label>
                    <Input
                      id="servicesTitle"
                      value={data.services?.hero?.title || ""}
                      onChange={(e) => updateData(["services", "hero", "title"], e.target.value)}
                      placeholder="Our Services"
                    />
                  </div>
                  <div>
                    <Label htmlFor="servicesDescription">Services Page Description</Label>
                    <Textarea
                      id="servicesDescription"
                      value={data.services?.hero?.description || ""}
                      onChange={(e) => updateData(["services", "hero", "description"], e.target.value)}
                      placeholder="Comprehensive turnkey solutions..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Service Items</h3>
                  {data.services?.items?.map((service: any, index: number) => (
                    <Card key={service?._id || service?.id || index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-base">Service {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                     <div className="space-y-4">
                             <div>
                               <Label>Service Title</Label>
                               <Input
                                 value={service.title || ""}
                                 onChange={(e) => updateData(["services", "items", String(index), "title"], e.target.value)}
                                 placeholder="Service Title"
                               />
                             </div>
                             <div>
                               <Label>Service Subtitle</Label>
                               <Input
                                 value={service.subtitle || ""}
                                 onChange={(e) => updateData(["services", "items", String(index), "subtitle"], e.target.value)}
                                 placeholder="Service Subtitle"
                               />
                             </div>
                             <div>
                               <Label>Service Description</Label>
                               <Textarea
                                 value={service.description || ""}
                                 onChange={(e) => updateData(["services", "items", String(index), "description"], e.target.value)}
                                 placeholder="Service Description"
                                 rows={4}
                               />
                             </div>
                           </div>
                           <div>
                             <ImageUpload
                               currentImage={service.image}
                               onImageChange={(url) => updateData(["services", "items", String(index), "image"], url)}
                               label={`Service ${index + 1} Image`}
                               description="Service illustration or icon (recommended: 400x300px)"
                               aspectRatio="aspect-[4/3]"
                             />
                           </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["services", "items"], index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["services", "items"], index, Math.min((data.services?.items?.length || 1) - 1, index + 1))}
                            disabled={index === (data.services?.items?.length || 1) - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="servicesCTATitle">CTA Title</Label>
                    <Input
                      id="servicesCTATitle"
                      value={data.services?.cta?.title || ""}
                      onChange={(e) => updateData(["services", "cta", "title"], e.target.value)}
                      placeholder="Ready to Get Started?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="servicesCTADescription">CTA Description</Label>
                    <Textarea
                      id="servicesCTADescription"
                      value={data.services?.cta?.description || ""}
                      onChange={(e) => updateData(["services", "cta", "description"], e.target.value)}
                      placeholder="Contact us today to discuss which solution is right for your business."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="servicesCTAPrimaryButton">Primary Button Text</Label>
                      <Input
                        id="servicesCTAPrimaryButton"
                        value={data.services?.cta?.primaryButton || ""}
                        onChange={(e) => updateData(["services", "cta", "primaryButton"], e.target.value)}
                        placeholder="Contact Us Today"
                      />
                    </div>
                    <div>
                      <Label htmlFor="servicesCTASecondaryButton">Secondary Button Text</Label>
                      <Input
                        id="servicesCTASecondaryButton"
                        value={data.services?.cta?.secondaryButton || ""}
                        onChange={(e) => updateData(["services", "cta", "secondaryButton"], e.target.value)}
                        placeholder="View Case Studies"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Case Studies Tab */}
          <TabsContent value="cases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Case Studies Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caseStudiesTitle">Case Studies Page Title</Label>
                    <Input
                      id="caseStudiesTitle"
                      value={data.caseStudies?.hero?.title || ""}
                      onChange={(e) => updateData(["caseStudies", "hero", "title"], e.target.value)}
                      placeholder="Success Stories"
                    />
                  </div>
                  <div>
                    <Label htmlFor="caseStudiesDescription">Case Studies Page Description</Label>
                    <Textarea
                      id="caseStudiesDescription"
                      value={data.caseStudies?.hero?.description || ""}
                      onChange={(e) => updateData(["caseStudies", "hero", "description"], e.target.value)}
                      placeholder="See how our turnkey solutions have transformed operations..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Case Study Items</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCaseExpandAll(true)
                          const next: Record<string | number, boolean> = {}
                          ;(data.caseStudies?.items || []).forEach((it: any) => {
                            const key = it?._id || it?.id
                            if (key !== undefined) next[key] = true
                          })
                          setCaseItemExpanded(next)
                        }}
                      >
                        Expand All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCaseExpandAll(false)
                          const next: Record<string | number, boolean> = {}
                          ;(data.caseStudies?.items || []).forEach((it: any) => {
                            const key = it?._id || it?.id
                            if (key !== undefined) next[key] = false
                          })
                          setCaseItemExpanded(next)
                        }}
                      >
                        Collapse All
                      </Button>
                    </div>
                  </div>
                  {data.caseStudies?.items?.map((caseStudy: any, index: number) => (
                    <Card key={caseStudy?._id || caseStudy?.id || index} className="border-l-4 border-l-green-500">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const key = caseStudy?._id || caseStudy?.id || index
                              const current = caseItemExpanded[key] ?? caseExpandAll
                              setCaseItemExpanded({ ...caseItemExpanded, [key]: !current })
                            }}
                            title="Toggle"
                          >
                            {(caseItemExpanded[caseStudy?._id || caseStudy?.id || index] ?? caseExpandAll) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <CardTitle className="text-base">Case Study {index + 1}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["caseStudies", "items"], index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["caseStudies", "items"], index, Math.min((data.caseStudies?.items?.length || 1) - 1, index + 1))}
                            disabled={index === (data.caseStudies?.items?.length || 1) - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <ConfirmButton
                            title="Delete case study?"
                            description="This will permanently delete the case study."
                            confirmText="Delete"
                            onConfirm={() => {
                              const newItems = [...(data.caseStudies?.items || [])]
                              newItems.splice(index, 1)
                              updateData(["caseStudies", "items"], newItems)
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </ConfirmButton>
                        </div>
                      </CardHeader>
                      {(caseItemExpanded[caseStudy?._id || caseStudy?.id || index] ?? caseExpandAll) && (
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label>Case Study Title</Label>
                              <Input
                                value={caseStudy.title || ""}
                                onChange={(e) => updateData(["caseStudies", "items", String(index), "title"], e.target.value)}
                                placeholder="Case Study Title"
                              />
                            </div>
                            <div>
                              <Label>Client Name</Label>
                              <Input
                                value={caseStudy.client || ""}
                                onChange={(e) => updateData(["caseStudies", "items", String(index), "client"], e.target.value)}
                                placeholder="Client Company Name"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Industry</Label>
                                <Input
                                  value={caseStudy.industry || ""}
                                  onChange={(e) => updateData(["caseStudies", "items", String(index), "industry"], e.target.value)}
                                  placeholder="Industry"
                                />
                              </div>
                              <div>
                                <Label>Location</Label>
                                <Input
                                  value={caseStudy.location || ""}
                                  onChange={(e) => updateData(["caseStudies", "items", String(index), "location"], e.target.value)}
                                  placeholder="Location"
                                />
                              </div>
                              <div>
                                <Label>Date</Label>
                                <Input
                                  value={caseStudy.date || ""}
                                  onChange={(e) => updateData(["caseStudies", "items", String(index), "date"], e.target.value)}
                                  placeholder="2024"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Challenge</Label>
                              <Textarea
                                value={caseStudy.challenge || ""}
                                onChange={(e) => updateData(["caseStudies", "items", String(index), "challenge"], e.target.value)}
                                placeholder="What challenges did the client face?"
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Solution</Label>
                              <Textarea
                                value={caseStudy.solution || ""}
                                onChange={(e) => updateData(["caseStudies", "items", String(index), "solution"], e.target.value)}
                                placeholder="How did we solve their problems?"
                                rows={3}
                              />
                            </div>
                            <div>
                              <TagEditor
                                tags={caseStudy.tags || []}
                                onChange={(next) => {
                                  const newItems = [...(data.caseStudies?.items || [])]
                                  newItems[index] = { ...caseStudy, tags: next }
                                  updateData(["caseStudies", "items"], newItems)
                                }}
                                suggestions={["Logistics","IoT","Warehouse Management","Automation","Healthcare","Scalability","Integration"]}
                              />
                            </div>
                            <div>
                              <Label>Key Results</Label>
                              <div className="space-y-2">
                                {(caseStudy.results || []).map((res: string, resIndex: number) => (
                                  <div key={`${resIndex}-${res ?? ''}`} className="flex gap-2 items-center">
                                    <Input
                                      value={res || ""}
                                      onChange={(e) => {
                                        const newResults = [...(caseStudy.results || [])]
                                        newResults[resIndex] = e.target.value
                                        const newItems = [...(data.caseStudies?.items || [])]
                                        newItems[index] = { ...caseStudy, results: newResults }
                                        updateData(["caseStudies", "items"], newItems)
                                      }}
                                      placeholder="e.g., 40% cost reduction"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newResults = [...(caseStudy.results || [])]
                                        const from = resIndex
                                        const to = Math.max(0, resIndex - 1)
                                        if (from !== to) {
                                          const [m] = newResults.splice(from, 1)
                                          newResults.splice(to, 0, m)
                                          const newItems = [...(data.caseStudies?.items || [])]
                                          newItems[index] = { ...caseStudy, results: newResults }
                                          updateData(["caseStudies", "items"], newItems)
                                        }
                                      }}
                                      disabled={resIndex === 0}
                                      title="Move up"
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newResults = [...(caseStudy.results || [])]
                                        const from = resIndex
                                        const to = Math.min((caseStudy.results?.length || 1) - 1, resIndex + 1)
                                        if (from !== to) {
                                          const [m] = newResults.splice(from, 1)
                                          newResults.splice(to, 0, m)
                                          const newItems = [...(data.caseStudies?.items || [])]
                                          newItems[index] = { ...caseStudy, results: newResults }
                                          updateData(["caseStudies", "items"], newItems)
                                        }
                                      }}
                                      disabled={resIndex === (caseStudy.results?.length || 1) - 1}
                                      title="Move down"
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <ConfirmButton
                                      title="Remove result?"
                                      description="This will permanently remove the result."
                                      confirmText="Remove"
                                      onConfirm={() => {
                                        const newResults = [...(caseStudy.results || [])]
                                        newResults.splice(resIndex, 1)
                                        const newItems = [...(data.caseStudies?.items || [])]
                                        newItems[index] = { ...caseStudy, results: newResults }
                                        updateData(["caseStudies", "items"], newItems)
                                      }}
                                    >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                    </ConfirmButton>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newResults = [...(caseStudy.results || []), ""]
                                    const newItems = [...(data.caseStudies?.items || [])]
                                    newItems[index] = { ...caseStudy, results: newResults }
                                    updateData(["caseStudies", "items"], newItems)
                                  }}
                                >
                                  Add Result
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div>
                            <ImageUpload
                              currentImage={caseStudy.image}
                              onImageChange={(url) => updateData(["caseStudies", "items", String(index), "image"], url)}
                              label={`Case Study ${index + 1} Image`}
                              description="Case study hero image (recommended: 600x400px)"
                              aspectRatio="aspect-[3/2]"
                            />
                          </div>
                        </div>
                      </CardContent>
                      )}
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const items = [...(data.caseStudies?.items || [])]
                      const nextId = items.reduce((max, it) => {
                        const val = typeof it?.id === 'number' ? it.id : Number(it?.id) || 0
                        return Math.max(max, val)
                      }, 0) + 1
                      const newItem = {
                        _id: generateId(),
                        id: nextId,
                        title: "",
                        client: "",
                        industry: "",
                        location: "",
                        date: "",
                        challenge: "",
                        solution: "",
                        results: [],
                        image: "",
                        tags: []
                      }
                      updateData(["caseStudies", "items"], [...items, newItem])
                    }}
                  >
                    Add Case Study
                  </Button>
                </div>

                <Separator />

                {/* Stats Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Stats Section</h3>
                  <div>
                    <Label htmlFor="caseStudiesStatsTitle">Stats Title</Label>
                    <Input
                      id="caseStudiesStatsTitle"
                      value={data.caseStudies?.stats?.title || ""}
                      onChange={(e) => updateData(["caseStudies", "stats", "title"], e.target.value)}
                      placeholder="Proven Results Across Industries"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.caseStudies?.stats?.items || []).map((stat: any, index: number) => (
                      <div key={stat?._id || index} className="space-y-2">
                        <Label>Stat {index + 1}</Label>
                        <div className="space-y-2">
                          <Input
                            value={stat.number || ""}
                            onChange={(e) => {
                              const newStats = [...(data.caseStudies?.stats?.items || [])];
                              newStats[index] = { ...stat, number: e.target.value };
                              updateData(["caseStudies", "stats", "items"], newStats);
                            }}
                            placeholder="500+"
                          />
                          <Input
                            value={stat.label || ""}
                            onChange={(e) => {
                              const newStats = [...(data.caseStudies?.stats?.items || [])];
                              newStats[index] = { ...stat, label: e.target.value };
                              updateData(["caseStudies", "stats", "items"], newStats);
                            }}
                            placeholder="Projects Completed"
                          />
                          <Input
                            value={stat.color || ""}
                            onChange={(e) => {
                              const newStats = [...(data.caseStudies?.stats?.items || [])];
                              newStats[index] = { ...stat, color: e.target.value };
                              updateData(["caseStudies", "stats", "items"], newStats);
                            }}
                            placeholder="text-[#FF6B35]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["caseStudies", "stats", "items"], index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["caseStudies", "stats", "items"], index, Math.min((data.caseStudies?.stats?.items?.length || 1) - 1, index + 1))}
                            disabled={index === (data.caseStudies?.stats?.items?.length || 1) - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newStats = [...(data.caseStudies?.stats?.items || [])];
                              newStats.splice(index, 1);
                              updateData(["caseStudies", "stats", "items"], newStats);
                            }}
                            className="text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newStats = [...(data.caseStudies?.stats?.items || []), { _id: generateId(), number: "", label: "", color: "" }];
                      updateData(["caseStudies", "stats", "items"], newStats);
                    }}
                  >
                    Add Stat
                  </Button>
                </div>

                <Separator />

                {/* CTA Section */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caseStudiesCTATitle">CTA Title</Label>
                    <Input
                      id="caseStudiesCTATitle"
                      value={data.caseStudies?.cta?.title || ""}
                      onChange={(e) => updateData(["caseStudies", "cta", "title"], e.target.value)}
                      placeholder="Ready to Write Your Success Story?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="caseStudiesCTADescription">CTA Description</Label>
                    <Textarea
                      id="caseStudiesCTADescription"
                      value={data.caseStudies?.cta?.description || ""}
                      onChange={(e) => updateData(["caseStudies", "cta", "description"], e.target.value)}
                      placeholder="Join these industry leaders..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="caseStudiesCTAPrimaryButton">Primary Button Text</Label>
                      <Input
                        id="caseStudiesCTAPrimaryButton"
                        value={data.caseStudies?.cta?.primaryButton || ""}
                        onChange={(e) => updateData(["caseStudies", "cta", "primaryButton"], e.target.value)}
                        placeholder="Start Your Transformation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="caseStudiesCTASecondaryButton">Secondary Button Text</Label>
                      <Input
                        id="caseStudiesCTASecondaryButton"
                        value={data.caseStudies?.cta?.secondaryButton || ""}
                        onChange={(e) => updateData(["caseStudies", "cta", "secondaryButton"], e.target.value)}
                        placeholder="Explore Our Solutions"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Hero Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whyUsTitle">Why Us Title</Label>
                  <Input
                    id="whyUsTitle"
                    value={data.whyUs?.hero?.title || ""}
                    onChange={(e) => updateData(["whyUs", "hero", "title"], e.target.value)}
                    placeholder="Why Choose MyWorkApp.io?"
                  />
                </div>
                <div>
                  <Label htmlFor="whyUsDescription">Why Us Description</Label>
                  <Textarea
                    id="whyUsDescription"
                    value={data.whyUs?.hero?.description || ""}
                    onChange={(e) => updateData(["whyUs", "hero", "description"], e.target.value)}
                    placeholder="We're not just another software company..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Stats Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(data.whyUs?.stats || []).map((stat: any, index: number) => (
                    <div key={stat?._id || index} className="space-y-2">
                      <Label>Stat {index + 1}</Label>
                      <div className="space-y-2">
                        <Input
                          value={stat.number || ""}
                          onChange={(e) => {
                            const newStats = [...(data.whyUs?.stats || [])];
                            newStats[index] = { ...stat, number: e.target.value };
                            updateData(["whyUs", "stats"], newStats);
                          }}
                          placeholder="500+"
                        />
                        <Input
                          value={stat.label || ""}
                          onChange={(e) => {
                            const newStats = [...(data.whyUs?.stats || [])];
                            newStats[index] = { ...stat, label: e.target.value };
                            updateData(["whyUs", "stats"], newStats);
                          }}
                          placeholder="Successful Projects"
                        />
                        <Input
                          value={stat.color || ""}
                          onChange={(e) => {
                            const newStats = [...(data.whyUs?.stats || [])];
                            newStats[index] = { ...stat, color: e.target.value };
                            updateData(["whyUs", "stats"], newStats);
                          }}
                          placeholder="text-[#FF6B35]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["whyUs", "stats"], index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => reorderArrayAtPath(["whyUs", "stats"], index, Math.min((data.whyUs?.stats?.length || 1) - 1, index + 1))}
                          disabled={index === (data.whyUs?.stats?.length || 1) - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reasons Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>Reasons Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reasonsTitle">Reasons Title</Label>
                    <Input
                      id="reasonsTitle"
                      value={data.whyUs?.reasons?.title || ""}
                      onChange={(e) => updateData(["whyUs", "reasons", "title"], e.target.value)}
                      placeholder="What Sets Us Apart"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reasonsDescription">Reasons Description</Label>
                    <Textarea
                      id="reasonsDescription"
                      value={data.whyUs?.reasons?.description || ""}
                      onChange={(e) => updateData(["whyUs", "reasons", "description"], e.target.value)}
                      placeholder="We combine deep industry expertise..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Reason Items</h3>
                  {(data.whyUs?.reasons?.items || []).map((reason: any, index: number) => (
                    <Card key={reason?._id || index} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="text-base">Reason {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Icon Name</Label>
                            <Input
                              value={reason.icon || ""}
                              onChange={(e) => {
                                const newItems = [...(data.whyUs?.reasons?.items || [])];
                                newItems[index] = { ...reason, icon: e.target.value };
                                updateData(["whyUs", "reasons", "items"], newItems);
                              }}
                              placeholder="Zap"
                            />
                          </div>
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={reason.title || ""}
                              onChange={(e) => {
                                const newItems = [...(data.whyUs?.reasons?.items || [])];
                                newItems[index] = { ...reason, title: e.target.value };
                                updateData(["whyUs", "reasons", "items"], newItems);
                              }}
                              placeholder="Turnkey Solutions"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={reason.description || ""}
                            onChange={(e) => {
                              const newItems = [...(data.whyUs?.reasons?.items || [])];
                              newItems[index] = { ...reason, description: e.target.value };
                              updateData(["whyUs", "reasons", "items"], newItems);
                            }}
                            placeholder="Complete, ready-to-use systems..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["whyUs", "reasons", "items"], index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["whyUs", "reasons", "items"], index, Math.min((data.whyUs?.reasons?.items?.length || 1) - 1, index + 1))}
                            disabled={index === (data.whyUs?.reasons?.items?.length || 1) - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Process Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="processTitle">Process Title</Label>
                    <Input
                      id="processTitle"
                      value={data.whyUs?.process?.title || ""}
                      onChange={(e) => updateData(["whyUs", "process", "title"], e.target.value)}
                      placeholder="Our Proven Process"
                    />
                  </div>
                  <div>
                    <Label htmlFor="processDescription">Process Description</Label>
                    <Textarea
                      id="processDescription"
                      value={data.whyUs?.process?.description || ""}
                      onChange={(e) => updateData(["whyUs", "process", "description"], e.target.value)}
                      placeholder="From consultation to deployment..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Process Steps</h3>
                  {(data.whyUs?.process?.steps || []).map((step: any, index: number) => (
                    <Card key={step?._id || index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-base">Step {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Step Number</Label>
                            <Input
                              value={step.step || ""}
                              onChange={(e) => {
                                const newSteps = [...(data.whyUs?.process?.steps || [])];
                                newSteps[index] = { ...step, step: e.target.value };
                                updateData(["whyUs", "process", "steps"], newSteps);
                              }}
                              placeholder="01"
                            />
                          </div>
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={step.title || ""}
                              onChange={(e) => {
                                const newSteps = [...(data.whyUs?.process?.steps || [])];
                                newSteps[index] = { ...step, title: e.target.value };
                                updateData(["whyUs", "process", "steps"], newSteps);
                              }}
                              placeholder="Consultation"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={step.description || ""}
                              onChange={(e) => {
                                const newSteps = [...(data.whyUs?.process?.steps || [])];
                                newSteps[index] = { ...step, description: e.target.value };
                                updateData(["whyUs", "process", "steps"], newSteps);
                              }}
                              placeholder="We analyze your needs..."
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["whyUs", "process", "steps"], index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => reorderArrayAtPath(["whyUs", "process", "steps"], index, Math.min((data.whyUs?.process?.steps?.length || 1) - 1, index + 1))}
                            disabled={index === (data.whyUs?.process?.steps?.length || 1) - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRight className="h-5 w-5" />
                  <span>Call to Action Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whyUsCTATitle">CTA Title</Label>
                  <Input
                    id="whyUsCTATitle"
                    value={data.whyUs?.cta?.title || ""}
                    onChange={(e) => updateData(["whyUs", "cta", "title"], e.target.value)}
                    placeholder="Ready to Experience the Difference?"
                  />
                </div>
                <div>
                  <Label htmlFor="whyUsCTADescription">CTA Description</Label>
                  <Textarea
                    id="whyUsCTADescription"
                    value={data.whyUs?.cta?.description || ""}
                    onChange={(e) => updateData(["whyUs", "cta", "description"], e.target.value)}
                    placeholder="Join hundreds of companies..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whyUsCTAPrimaryButton">Primary Button Text</Label>
                    <Input
                      id="whyUsCTAPrimaryButton"
                      value={data.whyUs?.cta?.primaryButton || ""}
                      onChange={(e) => updateData(["whyUs", "cta", "primaryButton"], e.target.value)}
                      placeholder="Get Free Consultation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whyUsCTASecondaryButton">Secondary Button Text</Label>
                    <Input
                      id="whyUsCTASecondaryButton"
                      value={data.whyUs?.cta?.secondaryButton || ""}
                      onChange={(e) => updateData(["whyUs", "cta", "secondaryButton"], e.target.value)}
                      placeholder="View Success Stories"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Hero Section</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactTitle">Contact Page Title</Label>
                  <Input
                    id="contactTitle"
                    value={data.contact?.hero?.title || ""}
                    onChange={(e) => updateData(["contact", "hero", "title"], e.target.value)}
                    placeholder="Get In Touch"
                  />
                </div>
                <div>
                  <Label htmlFor="contactDescription">Contact Page Description</Label>
                  <Textarea
                    id="contactDescription"
                    value={data.contact?.hero?.description || ""}
                    onChange={(e) => updateData(["contact", "hero", "description"], e.target.value)}
                    placeholder="Ready to transform your operations?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Info Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(data.contact?.info || []).map((info: any, index: number) => (
                    <div key={info?._id || index} className="space-y-2">
                      <Label>Contact Info {index + 1}</Label>
                      <div className="space-y-2">
                        <Input
                          value={info.icon || ""}
                          onChange={(e) => {
                            const newInfo = [...(data.contact?.info || [])];
                            newInfo[index] = { ...info, icon: e.target.value };
                            updateData(["contact", "info"], newInfo);
                          }}
                          placeholder="MapPin"
                        />
                        <Input
                          value={info.title || ""}
                          onChange={(e) => {
                            const newInfo = [...(data.contact?.info || [])];
                            newInfo[index] = { ...info, title: e.target.value };
                            updateData(["contact", "info"], newInfo);
                          }}
                          placeholder="Office Location"
                        />
                        <Textarea
                          value={info.info || ""}
                          onChange={(e) => {
                            const newInfo = [...(data.contact?.info || [])];
                            newInfo[index] = { ...info, info: e.target.value };
                            updateData(["contact", "info"], newInfo);
                          }}
                          placeholder="123 Business District\nTech City, TC 12345"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Form Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Contact Form</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="formTitle">Form Title</Label>
                    <Input
                      id="formTitle"
                      value={data.contact?.form?.title || ""}
                      onChange={(e) => updateData(["contact", "form", "title"], e.target.value)}
                      placeholder="Send Us a Message"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Form Fields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data.contact?.form?.fields || {}).map(([fieldName, field]: [string, any]) => (
                      <div key={fieldName} className="space-y-2">
                        <Label>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} Field</Label>
                        <div className="space-y-2">
                          <Input
                            value={field.label || ""}
                            onChange={(e) => {
                              const newFields = { ...(data.contact?.form?.fields || {}) };
                              newFields[fieldName] = { ...field, label: e.target.value };
                              updateData(["contact", "form", "fields"], newFields);
                            }}
                            placeholder="Field Label"
                          />
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) => {
                              const newFields = { ...(data.contact?.form?.fields || {}) };
                              newFields[fieldName] = { ...field, placeholder: e.target.value };
                              updateData(["contact", "form", "fields"], newFields);
                            }}
                            placeholder="Field Placeholder"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="submitButton">Submit Button Text</Label>
                    <Input
                      id="submitButton"
                      value={data.contact?.form?.submitButton || ""}
                      onChange={(e) => updateData(["contact", "form", "submitButton"], e.target.value)}
                      placeholder="Send Message"
                    />
                  </div>
                  <div>
                    <Label htmlFor="submittingText">Submitting Text</Label>
                    <Input
                      id="submittingText"
                      value={data.contact?.form?.submittingText || ""}
                      onChange={(e) => updateData(["contact", "form", "submittingText"], e.target.value)}
                      placeholder="Sending..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="successTitle">Success Title</Label>
                    <Input
                      id="successTitle"
                      value={data.contact?.form?.successTitle || ""}
                      onChange={(e) => updateData(["contact", "form", "successTitle"], e.target.value)}
                      placeholder="Message Sent!"
                    />
                  </div>
                  <div>
                    <Label htmlFor="successMessage">Success Message</Label>
                    <Textarea
                      id="successMessage"
                      value={data.contact?.form?.successMessage || ""}
                      onChange={(e) => updateData(["contact", "form", "successMessage"], e.target.value)}
                      placeholder="Thank you for reaching out..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="successButton">Success Button Text</Label>
                    <Input
                      id="successButton"
                      value={data.contact?.form?.successButton || ""}
                      onChange={(e) => updateData(["contact", "form", "successButton"], e.target.value)}
                      placeholder="Send Another Message"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Blog Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="blogHeroTitle">Hero Title</Label>
                    <Input
                      id="blogHeroTitle"
                      value={data.blog?.hero?.title || ""}
                      onChange={(e) => updateData(["blog", "hero", "title"], e.target.value)}
                      placeholder="Latest Updates & Insights"
                    />
                  </div>
                  <div>
                    <Label htmlFor="blogHeroDescription">Hero Description</Label>
                    <Textarea
                      id="blogHeroDescription"
                      value={data.blog?.hero?.description || ""}
                      onChange={(e) => updateData(["blog", "hero", "description"], e.target.value)}
                      placeholder="Stay informed with our latest articles, industry insights, and company updates."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Newsletter Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newsletterTitle">Newsletter Title</Label>
                    <Input
                      id="newsletterTitle"
                      value={data.blog?.newsletter?.title || ""}
                      onChange={(e) => updateData(["blog", "newsletter", "title"], e.target.value)}
                      placeholder="Subscribe to Our Newsletter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsletterDescription">Newsletter Description</Label>
                    <Textarea
                      id="newsletterDescription"
                      value={data.blog?.newsletter?.description || ""}
                      onChange={(e) => updateData(["blog", "newsletter", "description"], e.target.value)}
                      placeholder="Get the latest updates and insights delivered directly to your inbox."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsletterButton">Button Text</Label>
                    <Input
                      id="newsletterButton"
                      value={data.blog?.newsletter?.buttonText || ""}
                      onChange={(e) => updateData(["blog", "newsletter", "buttonText"], e.target.value)}
                      placeholder="Subscribe Now"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Blog Posts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {(data.blog?.posts || []).map((post: any, index: number) => (
                    <Card key={post?._id || post?.id || index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{post.title || "Untitled Post"}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              const newPosts = [...(data.blog?.posts || [])];
                              newPosts.splice(index, 1);
                              updateData(["blog", "posts"], newPosts);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={post.title || ""}
                                onChange={(e) => {
                                  const newPosts = [...(data.blog?.posts || [])];
                                  newPosts[index] = { ...post, title: e.target.value };
                                  updateData(["blog", "posts"], newPosts);
                                }}
                                placeholder="Post Title"
                              />
                            </div>
                            <div>
                              <Label>Author</Label>
                              <Input
                                value={post.author || ""}
                                onChange={(e) => {
                                  const newPosts = [...(data.blog?.posts || [])];
                                  newPosts[index] = { ...post, author: e.target.value };
                                  updateData(["blog", "posts"], newPosts);
                                }}
                                placeholder="Author Name"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Date</Label>
                              <Input
                                value={post.date || ""}
                                onChange={(e) => {
                                  const newPosts = [...(data.blog?.posts || [])];
                                  newPosts[index] = { ...post, date: e.target.value };
                                  updateData(["blog", "posts"], newPosts);
                                }}
                                placeholder="March 15, 2024"
                              />
                            </div>
                            <div>
                              <Label>Read Time</Label>
                              <Input
                                value={post.readTime || ""}
                                onChange={(e) => {
                                  const newPosts = [...(data.blog?.posts || [])];
                                  newPosts[index] = { ...post, readTime: e.target.value };
                                  updateData(["blog", "posts"], newPosts);
                                }}
                                placeholder="8 min read"
                              />
                            </div>
                            <div>
                              <Label>Category</Label>
                              <Input
                                value={post.category || ""}
                                onChange={(e) => {
                                  const newPosts = [...(data.blog?.posts || [])];
                                  newPosts[index] = { ...post, category: e.target.value };
                                  updateData(["blog", "posts"], newPosts);
                                }}
                                placeholder="Supply Chain"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Excerpt</Label>
                            <Textarea
                              value={post.excerpt || ""}
                              onChange={(e) => {
                                const newPosts = [...(data.blog?.posts || [])];
                                newPosts[index] = { ...post, excerpt: e.target.value };
                                updateData(["blog", "posts"], newPosts);
                              }}
                              placeholder="Brief description of the post..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <TagEditor
                              label="Tags"
                              tags={post.tags || []}
                              onChange={(next) => {
                                const newPosts = [...(data.blog?.posts || [])]
                                newPosts[index] = { ...post, tags: next }
                                updateData(["blog", "posts"], newPosts)
                              }}
                              suggestions={[
                                "Supply Chain","IoT Technology","Digital Transformation","Automation","Implementation","ROI Analysis","Best Practices","Warehousing","Logistics"
                              ]}
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`featured-${index}`}
                                checked={post.featured || false}
                                onChange={(e) => {
                                  const newPosts = [...(data.blog?.posts || [])];
                                  newPosts[index] = { ...post, featured: e.target.checked };
                                  updateData(["blog", "posts"], newPosts);
                                }}
                              />
                              <Label htmlFor={`featured-${index}`}>Featured Post</Label>
                            </div>
                          </div>
                          <div>
                            <Label>Image URL</Label>
                            <Input
                              value={post.image || ""}
                              onChange={(e) => {
                                const newPosts = [...(data.blog?.posts || [])];
                                newPosts[index] = { ...post, image: e.target.value };
                                updateData(["blog", "posts"], newPosts);
                              }}
                              placeholder="/images/blog-1.jpg"
                            />
                          </div>
                          <div>
                            <Label>Content</Label>
                            <Textarea
                              value={post.content || ""}
                              onChange={(e) => {
                                const newPosts = [...(data.blog?.posts || [])];
                                newPosts[index] = { ...post, content: e.target.value };
                                updateData(["blog", "posts"], newPosts);
                              }}
                              placeholder="Full blog post content..."
                              rows={6}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    onClick={() => {
                      const newPost = {
                        id: Date.now(),
                        title: "",
                        excerpt: "",
                        author: "",
                        date: new Date().toISOString().split('T')[0],
                        readTime: "",
                        category: "",
                        image: "",
                        featured: false,
                        content: "",
                        tags: []
                      };
                      updateData(["blog", "posts"], [...(data.blog?.posts || []), newPost]);
                    }}
                    className="w-full"
                  >
                    Add New Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
      
      <Toaster />
    </div>
  )
}
