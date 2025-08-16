"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import ContactForm from "@/components/contact-form"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import LoadingScreen from "@/app/loading-screen"
import { AnimatePresence } from "framer-motion"
import { useCMS } from "@/hooks/use-cms"

// Icon map for contact info
const iconMap = { MapPin, Phone, Mail, Clock }

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { content, isLoading: cmsLoading } = useCMS()

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isLoading])

  // Use CMS data or fallback to default content
  const contactData = content.contact || {
    hero: {
      title: "Get In Touch",
      description: "Ready to transform your operations? Let's discuss how our turnkey solutions can help your business."
    },
    info: [
      {
        icon: "MapPin",
        title: "Office Location",
        info: "123 Business District\nTech City, TC 12345"
      },
      {
        icon: "Phone",
        title: "Phone",
        info: "+1 (555) 123-4567"
      },
      {
        icon: "Mail",
        title: "Email",
        info: "hello@myworkapp.io"
      },
      {
        icon: "Clock",
        title: "Business Hours",
        info: "Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: Closed"
      }
    ]
  }

  // Ensure info array exists and is an array
  const contactInfo = Array.isArray(contactData.info) ? contactData.info : [
    {
      icon: "MapPin",
      title: "Office Location",
      info: "123 Business District\nTech City, TC 12345"
    },
    {
      icon: "Phone",
      title: "Phone",
      info: "+1 (555) 123-4567"
    },
    {
      icon: "Mail",
      title: "Email",
      info: "hello@myworkapp.io"
    },
    {
      icon: "Clock",
      title: "Business Hours",
      info: "Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: Closed"
    }
  ]

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}</AnimatePresence>
      <Navigation />

      <main className="pt-16 bg-white text-gray-900">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[#0F4C81]">{contactData.hero.title}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {contactData.hero.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">Contact Information</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Ready to transform your business operations? Contact us today to discuss your specific needs.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {contactInfo && Array.isArray(contactInfo) ? contactInfo.map((item, index) => {
                      const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                      const bgColors = ["bg-[#0F4C81]", "bg-[#FF6B35]", "bg-[#FFCF40]", "bg-[#0F4C81]"]
                      const bgColor = bgColors[index % bgColors.length]
                      return (
                        <div key={item.title} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#0F4C81] mb-1">{item.title}</h3>
                            {item.icon === "Phone" ? (
                              <a href={`tel:${item.info.replace(/\D/g, '')}`} className="text-gray-600 hover:text-[#FF6B35] transition-colors">
                                {item.info}
                              </a>
                            ) : item.icon === "Mail" ? (
                              <a href={`mailto:${item.info}`} className="text-gray-600 hover:text-[#FF6B35] transition-colors">
                                {item.info}
                              </a>
                            ) : (
                              <p className="text-gray-600 whitespace-pre-line">{item.info}</p>
                            )}
                          </div>
                        </div>
                      )
                    }) : null}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
