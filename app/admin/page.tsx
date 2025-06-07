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
      console.log("Fetching CMS data...")
      const response = await fetch("/api/cms")
      console.log("API response status:", response.status)
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log("CMS Data loaded:", result)
      console.log("Home hero data:", result?.home?.hero)
      setData(result)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "❌ Error",
        description: `Failed to load CMS data: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
        {/* Status Info */}
        <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold text-green-800">✅ CMS Data Loaded Successfully</h3>
          <p className="text-green-700">Ready to edit content below</p>
        </div>
        
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white rounded-xl shadow-sm border p-1">
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
            <TabsTrigger
              value="contact"
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">📞 Contact</span>
              <span className="sm:hidden">📞</span>
            </TabsTrigger>
            <TabsTrigger
              value="footer"
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">🔗 Footer</span>
              <span className="sm:hidden">🔗</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">🏠 Hero Section - Homepage Banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="hero-title" className="text-lg font-semibold">Main Title</Label>
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
                    className="mt-2 p-3 text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.home?.hero?.title}</p>
                </div>
                <div>
                  <Label htmlFor="hero-subtitle" className="text-lg font-semibold">Subtitle</Label>
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
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.home?.hero?.subtitle}</p>
                </div>
                <div>
                  <Label htmlFor="hero-description" className="text-lg font-semibold">Description</Label>
                  <Textarea
                    id="hero-description"
                    value={data?.home?.hero?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.home) newData.home = {}
                      if (!newData.home.hero) newData.home.hero = {}
                      newData.home.hero.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Hero description text"
                    rows={4}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.home?.hero?.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-800">📋 About/Why Us Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="whyus-title" className="text-lg font-semibold">Why Us Title</Label>
                  <Input
                    id="whyus-title"
                    value={data?.whyUs?.hero?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.whyUs) newData.whyUs = {}
                      if (!newData.whyUs.hero) newData.whyUs.hero = {}
                      newData.whyUs.hero.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Why choose us title"
                    className="mt-2 p-3 text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.whyUs?.hero?.title}</p>
                </div>
                <div>
                  <Label htmlFor="whyus-description" className="text-lg font-semibold">Why Us Description</Label>
                  <Textarea
                    id="whyus-description"
                    value={data?.whyUs?.hero?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.whyUs) newData.whyUs = {}
                      if (!newData.whyUs.hero) newData.whyUs.hero = {}
                      newData.whyUs.hero.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Why choose us description"
                    rows={4}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.whyUs?.hero?.description}</p>
                </div>
                <div>
                  <Label htmlFor="reasons-title" className="text-lg font-semibold">Reasons Section Title</Label>
                  <Input
                    id="reasons-title"
                    value={data?.whyUs?.reasons?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.whyUs) newData.whyUs = {}
                      if (!newData.whyUs.reasons) newData.whyUs.reasons = {}
                      newData.whyUs.reasons.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="What sets us apart title"
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.whyUs?.reasons?.title}</p>
                </div>
                <div>
                  <Label htmlFor="reasons-description" className="text-lg font-semibold">Reasons Description</Label>
                  <Textarea
                    id="reasons-description"
                    value={data?.whyUs?.reasons?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.whyUs) newData.whyUs = {}
                      if (!newData.whyUs.reasons) newData.whyUs.reasons = {}
                      newData.whyUs.reasons.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Reasons section description"
                    rows={3}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.whyUs?.reasons?.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">⚙️ Services Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="services-title" className="text-lg font-semibold">Services Page Title</Label>
                  <Input
                    id="services-title"
                    value={data?.services?.hero?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.services) newData.services = {}
                      if (!newData.services.hero) newData.services.hero = {}
                      newData.services.hero.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Services page title"
                    className="mt-2 p-3 text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.services?.hero?.title}</p>
                </div>
                <div>
                  <Label htmlFor="services-description" className="text-lg font-semibold">Services Description</Label>
                  <Textarea
                    id="services-description"
                    value={data?.services?.hero?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.services) newData.services = {}
                      if (!newData.services.hero) newData.services.hero = {}
                      newData.services.hero.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Services page description"
                    rows={3}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.services?.hero?.description}</p>
                </div>
                
                {/* Individual Service Items */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Individual Services</h3>
                  {data?.services?.items?.map((service: any, index: number) => (
                    <div key={index} className="mb-8 p-4 border border-gray-200 rounded">
                      <h4 className="font-semibold mb-3">Service {index + 1}: {service.title}</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`service-${index}-title`}>Service Title</Label>
                          <Input
                            id={`service-${index}-title`}
                            value={service.title || ""}
                            onChange={(e) => {
                              const newData = { ...data }
                              if (!newData.services?.items) return
                              newData.services.items[index].title = e.target.value
                              setData(newData)
                            }}
                            className="mt-1 p-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`service-${index}-subtitle`}>Service Subtitle</Label>
                          <Input
                            id={`service-${index}-subtitle`}
                            value={service.subtitle || ""}
                            onChange={(e) => {
                              const newData = { ...data }
                              if (!newData.services?.items) return
                              newData.services.items[index].subtitle = e.target.value
                              setData(newData)
                            }}
                            className="mt-1 p-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`service-${index}-description`}>Service Description</Label>
                          <Textarea
                            id={`service-${index}-description`}
                            value={service.description || ""}
                            onChange={(e) => {
                              const newData = { ...data }
                              if (!newData.services?.items) return
                              newData.services.items[index].description = e.target.value
                              setData(newData)
                            }}
                            rows={3}
                            className="mt-1 p-2"
                          />
                        </div>
                      </div>
                    </div>
                  )) || []}
                </div>
                
                <div>
                  <Label htmlFor="services-cta-title" className="text-lg font-semibold">Services CTA Title</Label>
                  <Input
                    id="services-cta-title"
                    value={data?.services?.cta?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.services) newData.services = {}
                      if (!newData.services.cta) newData.services.cta = {}
                      newData.services.cta.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Services call-to-action title"
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.services?.cta?.title}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site">
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">🌐 Site Information - General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="site-name" className="text-lg font-semibold">Site Name</Label>
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
                    className="mt-2 p-3 text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.site?.name}</p>
                </div>
                <div>
                  <Label htmlFor="site-description" className="text-lg font-semibold">Site Description</Label>
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
                    rows={4}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.site?.description}</p>
                </div>
                <div>
                  <Label htmlFor="site-tagline" className="text-lg font-semibold">Tagline</Label>
                  <Input
                    id="site-tagline"
                    value={data?.site?.tagline || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.site) newData.site = {}
                      newData.site.tagline = e.target.value
                      setData(newData)
                    }}
                    placeholder="Site tagline"
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.site?.tagline}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-800">📝 Blog Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="blog-title" className="text-lg font-semibold">Blog Page Title</Label>
                  <Input
                    id="blog-title"
                    value={data?.blog?.hero?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.blog) newData.blog = {}
                      if (!newData.blog.hero) newData.blog.hero = {}
                      newData.blog.hero.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Blog page title"
                    className="mt-2 p-3 text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.blog?.hero?.title}</p>
                </div>
                <div>
                  <Label htmlFor="blog-description" className="text-lg font-semibold">Blog Description</Label>
                  <Textarea
                    id="blog-description"
                    value={data?.blog?.hero?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.blog) newData.blog = {}
                      if (!newData.blog.hero) newData.blog.hero = {}
                      newData.blog.hero.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Blog page description"
                    rows={3}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.blog?.hero?.description}</p>
                </div>
                
                {/* Newsletter Section */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Newsletter Section</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newsletter-title" className="text-lg font-semibold">Newsletter Title</Label>
                      <Input
                        id="newsletter-title"
                        value={data?.blog?.newsletter?.title || ""}
                        onChange={(e) => {
                          const newData = { ...data }
                          if (!newData.blog) newData.blog = {}
                          if (!newData.blog.newsletter) newData.blog.newsletter = {}
                          newData.blog.newsletter.title = e.target.value
                          setData(newData)
                        }}
                        placeholder="Newsletter signup title"
                        className="mt-2 p-3"
                      />
                      <p className="text-sm text-gray-600 mt-1">Current: {data?.blog?.newsletter?.title}</p>
                    </div>
                    <div>
                      <Label htmlFor="newsletter-description" className="text-lg font-semibold">Newsletter Description</Label>
                      <Textarea
                        id="newsletter-description"
                        value={data?.blog?.newsletter?.description || ""}
                        onChange={(e) => {
                          const newData = { ...data }
                          if (!newData.blog) newData.blog = {}
                          if (!newData.blog.newsletter) newData.blog.newsletter = {}
                          newData.blog.newsletter.description = e.target.value
                          setData(newData)
                        }}
                        placeholder="Newsletter signup description"
                        rows={2}
                        className="mt-2 p-3"
                      />
                      <p className="text-sm text-gray-600 mt-1">Current: {data?.blog?.newsletter?.description}</p>
                    </div>
                  </div>
                </div>

                {/* Blog Posts */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Blog Posts ({data?.blog?.posts?.length || 0} posts)</h3>
                  <p className="text-gray-600 mb-4">Individual blog posts can be managed here. Each post includes title, excerpt, author, and category.</p>
                  {data?.blog?.posts?.slice(0, 3).map((post: any, index: number) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded">
                      <h4 className="font-semibold mb-3">Post {index + 1}: {post.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`post-${index}-title`}>Post Title</Label>
                          <Input
                            id={`post-${index}-title`}
                            value={post.title || ""}
                            onChange={(e) => {
                              const newData = { ...data }
                              if (!newData.blog?.posts) return
                              newData.blog.posts[index].title = e.target.value
                              setData(newData)
                            }}
                            className="mt-1 p-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`post-${index}-author`}>Author</Label>
                          <Input
                            id={`post-${index}-author`}
                            value={post.author || ""}
                            onChange={(e) => {
                              const newData = { ...data }
                              if (!newData.blog?.posts) return
                              newData.blog.posts[index].author = e.target.value
                              setData(newData)
                            }}
                            className="mt-1 p-2"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label htmlFor={`post-${index}-excerpt`}>Post Excerpt</Label>
                        <Textarea
                          id={`post-${index}-excerpt`}
                          value={post.excerpt || ""}
                          onChange={(e) => {
                            const newData = { ...data }
                            if (!newData.blog?.posts) return
                            newData.blog.posts[index].excerpt = e.target.value
                            setData(newData)
                          }}
                          rows={2}
                          className="mt-1 p-2"
                        />
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card className="border-2 border-indigo-200">
              <CardHeader className="bg-indigo-50">
                <CardTitle className="text-indigo-800">📞 Contact Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="contact-title" className="text-lg font-semibold">Contact Page Title</Label>
                  <Input
                    id="contact-title"
                    value={data?.contact?.hero?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.contact) newData.contact = {}
                      if (!newData.contact.hero) newData.contact.hero = {}
                      newData.contact.hero.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Contact page title"
                    className="mt-2 p-3 text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.contact?.hero?.title}</p>
                </div>
                <div>
                  <Label htmlFor="contact-description" className="text-lg font-semibold">Contact Description</Label>
                  <Textarea
                    id="contact-description"
                    value={data?.contact?.hero?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.contact) newData.contact = {}
                      if (!newData.contact.hero) newData.contact.hero = {}
                      newData.contact.hero.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Contact page description"
                    rows={3}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.contact?.hero?.description}</p>
                </div>
                <div>
                  <Label htmlFor="contact-form-title" className="text-lg font-semibold">Contact Form Title</Label>
                  <Input
                    id="contact-form-title"
                    value={data?.contact?.form?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.contact) newData.contact = {}
                      if (!newData.contact.form) newData.contact.form = {}
                      newData.contact.form.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Contact form title"
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.contact?.form?.title}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer">
            <Card className="border-2 border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-gray-800">🔗 Footer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="footer-description" className="text-lg font-semibold">Footer Description</Label>
                  <Textarea
                    id="footer-description"
                    value={data?.footer?.description || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.footer) newData.footer = {}
                      newData.footer.description = e.target.value
                      setData(newData)
                    }}
                    placeholder="Footer description text"
                    rows={3}
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.footer?.description}</p>
                </div>
                <div>
                  <Label htmlFor="footer-copyright" className="text-lg font-semibold">Copyright Text</Label>
                  <Input
                    id="footer-copyright"
                    value={data?.footer?.copyright || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.footer) newData.footer = {}
                      newData.footer.copyright = e.target.value
                      setData(newData)
                    }}
                    placeholder="Copyright text"
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.footer?.copyright}</p>
                </div>
                <div>
                  <Label htmlFor="quicklinks-title" className="text-lg font-semibold">Quick Links Title</Label>
                  <Input
                    id="quicklinks-title"
                    value={data?.footer?.quickLinks?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.footer) newData.footer = {}
                      if (!newData.footer.quickLinks) newData.footer.quickLinks = {}
                      newData.footer.quickLinks.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Quick links section title"
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.footer?.quickLinks?.title}</p>
                </div>
                <div>
                  <Label htmlFor="footer-contact-title" className="text-lg font-semibold">Footer Contact Title</Label>
                  <Input
                    id="footer-contact-title"
                    value={data?.footer?.contact?.title || ""}
                    onChange={(e) => {
                      const newData = { ...data }
                      if (!newData.footer) newData.footer = {}
                      if (!newData.footer.contact) newData.footer.contact = {}
                      newData.footer.contact.title = e.target.value
                      setData(newData)
                    }}
                    placeholder="Footer contact section title"
                    className="mt-2 p-3"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current: {data?.footer?.contact?.title}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}
