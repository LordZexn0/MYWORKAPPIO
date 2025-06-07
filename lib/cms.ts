import fs from "fs"
import path from "path"

// Type definitions for the CMS content structure
export interface CMSContent {
  site: {
    name: string
    tagline: string
    description: string
    logo: string
    contact: {
      phone: string
      email: string
      address: string
      businessHours: string
    }
  }
  navigation: {
    items: Array<{ href: string; label: string }>
    ctaButton: string
  }
  home: {
    hero: {
      title: string
      subtitle: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
    stats: Array<{ number: string; label: string }>
    overview: {
      title: string
      description: string
      services: string[]
      buttonText: string
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
  services: {
    hero: {
      title: string
      description: string
    }
    items: Array<{
      id: number
      title: string
      subtitle: string
      description: string
      features: string[]
      benefits: string[]
      image: string
    }>
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
  whyUs: {
    hero: {
      title: string
      description: string
    }
    stats: Array<{ number: string; label: string; color: string }>
    reasons: {
      title: string
      description: string
      items: Array<{
        icon: string
        title: string
        description: string
      }>
    }
    process: {
      title: string
      description: string
      steps: Array<{
        step: string
        title: string
        description: string
      }>
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
  caseStudies: {
    hero: {
      title: string
      description: string
    }
    items: Array<{
      id: number
      title: string
      client: string
      industry: string
      location: string
      date: string
      challenge: string
      solution: string
      results: string[]
      image: string
      tags: string[]
    }>
    stats: {
      title: string
      items: Array<{ number: string; label: string; color: string }>
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
  blog: {
    hero: {
      title: string
      description: string
    }
    categories: string[]
    posts: Array<{
      id: number
      title: string
      excerpt: string
      author: string
      date: string
      readTime: string
      category: string
      image: string
      featured: boolean
    }>
    newsletter: {
      title: string
      description: string
      placeholder: string
      buttonText: string
    }
  }
  contact: {
    hero: {
      title: string
      description: string
    }
    info: Array<{
      icon: string
      title: string
      info: string
    }>
    form: {
      title: string
      fields: {
        name: { label: string; placeholder: string }
        email: { label: string; placeholder: string }
        company: { label: string; placeholder: string }
        phone: { label: string; placeholder: string }
        message: { label: string; placeholder: string }
      }
      services: {
        label: string
        options: string[]
      }
      submitButton: string
      submittingText: string
      successTitle: string
      successMessage: string
      successButton: string
    }
  }
  footer: {
    description: string
    quickLinks: {
      title: string
      items: Array<{ href: string; label: string }>
    }
    contact: {
      title: string
      items: string[]
    }
    legal: Array<{ href: string; label: string }>
    copyright: string
  }
  supplyChain: {
    title: string
    description: string
    steps: Array<{
      icon: string
      title: string
      description: string
      color: string
    }>
    conclusion: string
  }
}

// Function to get CMS content
export function getCMSContent(): CMSContent {
  try {
    const filePath = path.join(process.cwd(), "cms", "content.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error reading CMS content:", error)
    throw new Error("Failed to load CMS content")
  }
}

// Function to get specific section content
export function getCMSSection<K extends keyof CMSContent>(section: K): CMSContent[K] {
  const content = getCMSContent()
  return content[section]
}

// Function to update CMS content
export function updateCMSContent(newContent: CMSContent): void {
  try {
    const filePath = path.join(process.cwd(), "cms", "content.json")
    fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2))
  } catch (error) {
    console.error("Error updating CMS content:", error)
    throw new Error("Failed to update CMS content")
  }
}

// Helper function to get icon component by name
export function getIconComponent(iconName: string) {
  const iconMap: { [key: string]: any } = {
    Warehouse: "Warehouse",
    Package: "Package",
    Truck: "Truck",
    BarChart3: "BarChart3",
    Zap: "Zap",
    Clock: "Clock",
    Shield: "Shield",
    Users: "Users",
    Award: "Award",
    CheckCircle: "CheckCircle",
    MapPin: "MapPin",
    Phone: "Phone",
    Mail: "Mail",
  }

  return iconMap[iconName] || "CheckCircle"
}
