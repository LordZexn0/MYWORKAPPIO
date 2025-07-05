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
    stats: Array<{
      number: string
      label: string
      color: string
    }>
    reasons: Array<{
      title: string
      description: string
      icon: string
    }>
    process: Array<{
      step: number
      title: string
      description: string
    }>
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
    stats: Array<{
      number: string
      label: string
    }>
    items: Array<{
      id: number
      title: string
      subtitle: string
      description: string
      results: string[]
      image: string
    }>
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
    posts: Array<{
      id: number
      title: string
      excerpt: string
      content: string
      author: string
      date: string
      readTime: string
      category: string
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
    info: {
      title: string
      items: string[]
    }
    form: {
      title: string
      description: string
      fields: Array<{
        name: string
        label: string
        type: string
        placeholder: string
        required: boolean
      }>
      submitButton: string
    }
  }
  supplyChain: {
    title: string
    description: string
    steps: Array<{
      title: string
      description: string
      icon: string
    }>
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
  services: {
    hero: {
      title: "Our Services",
      description: "Comprehensive turnkey solutions designed to transform your operations from day one."
    },
    items: [
      {
        id: 1,
        title: "Logistics and Supply Chain Management",
        subtitle: "End-to-End Visibility with a Turnkey Logistics Platform",
        description: "Our logistics management system is a turnkey solution designed to help businesses streamline supply chain operations without the need for complex setup or custom development.",
        features: [
          "Ready-to-use tools for inbound and outbound order management",
          "Automated approval workflows",
          "Real-time tracking of inventory across the supply chain",
          "Auditable logs for compliance and transparency",
          "Immediate time and cost savings with minimal onboarding"
        ],
        benefits: [
          "Reduce operational costs by 30%",
          "Improve delivery times by 50%",
          "99.9% inventory accuracy"
        ],
        image: "/images/logistics.png"
      }
    ],
    cta: {
      title: "Ready to Get Started?",
      description: "Contact us today to discuss which solution is right for your business.",
      primaryButton: "Contact Us Today",
      secondaryButton: "View Case Studies"
    }
  },
  whyUs: {
    hero: {
      title: "Why Choose MyWorkApp.io?",
      description: "We don't just build software – we deliver complete solutions that transform your business operations from day one."
    },
    stats: [
      { number: "500+", label: "Successful Projects", color: "text-[#FF6B35]" },
      { number: "99%", label: "Client Satisfaction", color: "text-[#FFCF40]" },
      { number: "50%", label: "Average Efficiency Gain", color: "text-[#0F4C81]" },
      { number: "24/7", label: "Support Available", color: "text-[#FF6B35]" }
    ],
    reasons: [
      {
        title: "Turnkey Solutions",
        description: "Complete, ready-to-use systems that work from day one.",
        icon: "Package"
      }
    ],
    process: [
      {
        step: 1,
        title: "Assessment",
        description: "We evaluate your current operations and identify improvement opportunities."
      }
    ],
    cta: {
      title: "Ready to Transform Your Operations?",
      description: "Get started with a free consultation and see how our turnkey solutions can streamline your business.",
      primaryButton: "Get Free Consultation",
      secondaryButton: "View Case Studies"
    }
  },
  caseStudies: {
    hero: {
      title: "Case Studies",
      description: "See how our turnkey solutions have transformed operations for businesses like yours."
    },
    stats: [
      { number: "500+", label: "Projects Completed" },
      { number: "99%", label: "Client Satisfaction" },
      { number: "50%", label: "Average Efficiency Gain" }
    ],
    items: [
      {
        id: 1,
        title: "Global Logistics Company",
        subtitle: "Streamlined Supply Chain Operations",
        description: "How we helped a global logistics company reduce costs and improve efficiency.",
        results: [
          "30% reduction in operational costs",
          "50% improvement in delivery times",
          "99.9% inventory accuracy"
        ],
        image: "/images/logistics.png"
      }
    ],
    cta: {
      title: "Ready to See Similar Results?",
      description: "Contact us today to discuss how our solutions can transform your operations.",
      primaryButton: "Get Free Consultation",
      secondaryButton: "View All Case Studies"
    }
  },
  blog: {
    hero: {
      title: "Our Blog",
      description: "Insights, updates, and best practices for modern business operations."
    },
    posts: [
      {
        id: 1,
        title: "The Future of Supply Chain Management",
        excerpt: "How technology is transforming logistics and supply chain operations.",
        content: "Full article content here...",
        author: "MyWorkApp Team",
        date: "2024-01-15",
        readTime: "5 min read",
        category: "Supply Chain",
        featured: true
      }
    ],
    newsletter: {
      title: "Stay Updated",
      description: "Get the latest insights delivered to your inbox.",
      placeholder: "Enter your email",
      buttonText: "Subscribe"
    }
  },
  contact: {
    hero: {
      title: "Contact Us",
      description: "Ready to transform your operations? Let's discuss how our turnkey solutions can help."
    },
    info: {
      title: "Get in Touch",
      items: [
        "123 Business District",
        "Tech City, TC 12345",
        "+1 (555) 123-4567",
        "hello@myworkapp.io"
      ]
    },
    form: {
      title: "Send us a Message",
      description: "Fill out the form below and we'll get back to you within 24 hours.",
      fields: [
        { name: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "your@email.com", required: true },
        { name: "message", label: "Message", type: "textarea", placeholder: "Tell us about your project", required: true }
      ],
      submitButton: "Send Message"
    }
  },
  supplyChain: {
    title: "Supply Chain Solutions",
    description: "End-to-end visibility and control for your supply chain operations.",
    steps: [
      {
        title: "Order Management",
        description: "Generate and approve orders with automated workflows.",
        icon: "ShoppingCart"
      }
    ]
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
