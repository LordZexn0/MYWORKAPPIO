"use client"

import { useState, useEffect } from "react"

interface CMSContent {
  site: {
    name: string
    logo: string
    description: string
    tagline: string
    contact: {
      address: string
      phone: string
      email: string
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
    stats: Array<{
      number: string
      label: string
    }>
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
  footer: {
    description: string
    copyright: string
    quickLinks: {
      title: string
      items: Array<{
        label: string
        href: string
      }>
    }
    contact: {
      title: string
      items: string[]
    }
    legal: Array<{
      label: string
      href: string
    }>
  }
}

const defaultContent: CMSContent = {
  site: {
    name: "MyWorkApp.io",
    logo: "/images/logo-transparent.png",
    description:
      "End-to-end turnkey solutions for logistics, warehouse management, IoT tracking, and custom workflows.",
    tagline: "Modern Solutions For Tomorrow's Challenges",
    contact: {
      address: "123 Business District\nTech City, TC 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@myworkapp.io",
      businessHours: "Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: Closed",
    },
  },
  navigation: {
    items: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
      { href: "/why-us", label: "Why Us" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
    ctaButton: "Get Started",
  },
  home: {
    hero: {
      title: "MyWorkApp.io",
      subtitle: "Modern Solutions For Tomorrow's Challenges",
      description:
        "Transform your operations with our turnkey solutions for logistics, warehouse management, IoT tracking, and custom digital workflows.",
      primaryButton: "Explore Our Services",
      secondaryButton: "View Case Studies",
    },
    stats: [
      { number: "500+", label: "Projects Completed" },
      { number: "99%", label: "Client Satisfaction" },
      { number: "24/7", label: "Support Available" },
    ],
    overview: {
      title: "Turnkey Solutions That Work",
      description: "We deliver complete, ready-to-use systems that transform your operations from day one.",
      services: [
        "Logistics & Supply Chain",
        "Digital Warehouse Management",
        "IoT Sensors & Tracking",
        "Custom Digital Workflows",
      ],
      buttonText: "Learn More About Our Services",
    },
    cta: {
      title: "Ready to Transform Your Operations?",
      description: "Get started with a free consultation and see how our turnkey solutions can streamline your business.",
      primaryButton: "Get Free Consultation",
      secondaryButton: "Why Choose Us",
    },
  },
  footer: {
    description:
      "Transforming operations with turnkey solutions for logistics, warehouse management, IoT tracking, and custom digital workflows.",
    copyright: "© {year} MyWorkApp.io. All rights reserved.",
    quickLinks: {
      title: "Quick Links",
      items: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Why Us", href: "/why-us" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    contact: {
      title: "Contact",
      items: ["123 Business District", "Tech City, TC 12345", "+1 (555) 123-4567", "hello@myworkapp.io"],
    },
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
}

// Global cache for CMS content
let cmsCache: CMSContent | null = null
let cmsCachePromise: Promise<CMSContent> | null = null
let cmsCacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useCMS() {
  const [content, setContent] = useState<CMSContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Check if we have valid cached data
        const now = Date.now()
        if (cmsCache && (now - cmsCacheTimestamp) < CACHE_DURATION) {
          setContent(cmsCache)
          setIsLoading(false)
          return
        }

        // Check if there's already a request in progress
        if (cmsCachePromise) {
          const data = await cmsCachePromise
          setContent(data)
          setIsLoading(false)
          return
        }

        setIsLoading(true)
        
        // Create new request
        cmsCachePromise = (async () => {
          const response = await fetch("/api/cms")
          if (!response.ok) {
            throw new Error("Failed to fetch CMS content")
          }
          const data = await response.json()
          
          // Update cache
          cmsCache = data
          cmsCacheTimestamp = now
          
          return data
        })()

        const data = await cmsCachePromise
        setContent(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching CMS content:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        // Keep using default content as fallback
      } finally {
        setIsLoading(false)
        cmsCachePromise = null
      }
    }

    fetchContent()
  }, [])

  return {
    content,
    isLoading,
    error,
  }
}

export function useCMSSection<K extends keyof CMSContent>(section: K) {
  const { content, isLoading } = useCMS()

  return {
    content: content[section],
    isLoading,
  }
}

// Function to clear cache (useful when content is updated from admin)
export function clearCMSCache() {
  cmsCache = null
  cmsCachePromise = null
  cmsCacheTimestamp = 0
}
