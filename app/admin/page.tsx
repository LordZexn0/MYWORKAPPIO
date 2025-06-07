"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, FileText, Info, ImageIcon, Users } from "lucide-react"

interface CMSData {
  site?: {
    name?: string
    logo?: string
    description?: string
    tagline?: string
    contact?: any
  }
  navigation?: any
  home?: {
    hero?: {
      title?: string
      subtitle?: string
      description?: string
      primaryButton?: string
      secondaryButton?: string
    }
    stats?: any[]
    overview?: any
    cta?: any
  }
  services?: {
    hero?: any
    items?: any[]
    cta?: any
  }
  whyUs?: any
  caseStudies?: any
  blog?: {
    hero?: any
    posts?: any[]
    newsletter?: any
  }
  contact?: any
  footer?: any
  supplyChain?: any
  [key: string]: any
}

export default function AdminPage() {
  const [data, setData] = useState<CMSData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/cms")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "❌ Error",
        description: "Failed to load CMS data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!data) return

    setSaving(true)
    try {
      const response = await fetch("/api/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "✅ Success!",
          description: "Website content has been updated successfully",
          duration: 5000,
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving data:", error)
      toast({
        title: "❌ Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, section: string, index?: number) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        const imageUrl = result.url

        if (!data) return

        const newData = { ...data }

        if (section === "services" && typeof index === "number" && newData.services?.items) {
          newData.services.items[index].image = imageUrl
        } else if (section === "blog" && typeof index === "number" && newData.blog?.posts) {
          newData.blog.posts[index].image = imageUrl
        }

        setData(newData)

        toast({
          title: "📸 Image Uploaded!",
          description: "Image has been uploaded successfully",
          duration: 3000,
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "❌ Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const updateData = (path: string[], value: any) => {
    if (!data) return

    const newData = { ...data }
    let current: any = newData

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    current[path[path.length - 1]] = value
    setData(newData)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CMS...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load CMS data</p>
          <Button onClick={fetchData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-xl shadow-sm border p-1">
            <TabsTrigger
              value="hero"
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">🏠 Hero</span>
              <span className="sm:hidden">🏠</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">📋 About</span>
              <span className="sm:hidden">📋</span>
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">⚙️ Services</span>
              <span className="sm:hidden">⚙️</span>
            </TabsTrigger>
            <TabsTrigger
              value="site"
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">🌐 Site Info</span>
              <span className="sm:hidden">🌐</span>
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">📝 Blog</span>
              <span className="sm:hidden">📝</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>🏠 Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={data?.home?.hero?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.home) newData.home = {}
                      if (!newData.home.hero) newData.home.hero = {}
                      newData.home.hero.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Main hero title"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={data?.home?.hero?.subtitle || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.home) newData.home = {}
                      if (!newData.home.hero) newData.home.hero = {}
                      newData.home.hero.subtitle = e.target.value
                      setData(newData)
                    }}
                    placeholder="Hero subtitle/description"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>📋 About Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">{/* Placeholder for About Section */}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Services Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">{/* Placeholder for Services Section */}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>🌐 Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={data?.site?.name || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.site) newData.site = {}
                      newData.site.name = e.target.value
                      setData(newData)
                    }}
                    placeholder="Website name"
                  />
                </div>
                <div>
                  <Label htmlFor="site-description">Description</Label>
                  <Textarea
                    id="site-description"
                    value={data?.site?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.site) newData.site = {}
                      newData.site.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Website description"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle>📝 Blog Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">{/* Placeholder for Blog Section */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}
