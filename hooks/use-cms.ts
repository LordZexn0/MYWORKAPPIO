"use client"

import { useState } from "react"

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

export function useCMS() {
  const [isLoading] = useState(false)

  return {
    content: defaultContent,
    isLoading,
  }
}

export function useCMSSection<K extends keyof CMSContent>(section: K) {
  const { content, isLoading } = useCMS()

  return {
    content: content[section],
    isLoading,
  }
}
