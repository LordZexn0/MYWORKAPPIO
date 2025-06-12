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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Trash2
} from "lucide-react"
import Image from "next/image"

interface CMSData {
  site?: {
    name?: string
    logo?: string
    logoTransparent?: string
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
  caseStudies?: {
    hero?: any
    items?: any[]
  }
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

export default function AdminPage() {
  const [data, setData] = useState<CMSData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("site")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/cms")
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const result = await response.json()
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

    current[path[path.length - 1]] = value
    setData(newData)
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
            </div>
            <div className="flex items-center space-x-3">
          <Button
            onClick={handleSave}
            disabled={saving}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
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
          </TabsList>

          {/* Site Settings Tab */}
          <TabsContent value="site" className="space-y-6">
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
                    </div>
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={data.site?.tagline || ""}
                        onChange={(e) => updateData(["site", "tagline"], e.target.value)}
                        placeholder="Modern Solutions For Tomorrow's Challenges"
                      />
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
          </TabsContent>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
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
                    <Card key={service.id || index} className="border-l-4 border-l-blue-500">
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
                      </CardContent>
                    </Card>
                  ))}
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
                  <h3 className="text-lg font-semibold">Case Study Items</h3>
                  {data.caseStudies?.items?.map((caseStudy: any, index: number) => (
                    <Card key={caseStudy.id || index} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="text-base">Case Study {index + 1}</CardTitle>
                      </CardHeader>
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
                            <div className="grid grid-cols-2 gap-4">
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
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>About / Why Us Section</span>
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
          </TabsContent>



          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
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
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}
