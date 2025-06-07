"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import ContactForm from "@/components/contact-form"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import LoadingScreen from "@/components/loading-screen"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <Navigation />

      <main className="pt-16 bg-white text-gray-900">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[#0F4C81]">Get In Touch</h1>
              <p className="text-xl text-gray-600 mb-8">
                Ready to transform your operations? Let&apos;s discuss how our turnkey solutions can help your business.
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
                    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                      <div className="w-12 h-12 bg-[#0F4C81] rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F4C81] mb-1">Address</h3>
                        <p className="text-gray-600">
                          123 Business District
                          <br />
                          Tech City, TC 12345
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                      <div className="w-12 h-12 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F4C81] mb-1">Phone</h3>
                        <a href="tel:+15551234567" className="text-gray-600 hover:text-[#FF6B35] transition-colors">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                      <div className="w-12 h-12 bg-[#FFCF40] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F4C81] mb-1">Email</h3>
                        <a
                          href="mailto:hello@myworkapp.io"
                          className="text-gray-600 hover:text-[#FF6B35] transition-colors"
                        >
                          hello@myworkapp.io
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                      <div className="w-12 h-12 bg-[#0F4C81] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F4C81] mb-1">Business Hours</h3>
                        <p className="text-gray-600">
                          Mon - Fri: 9:00 AM - 6:00 PM
                          <br />
                          Sat - Sun: Closed
                        </p>
                      </div>
                    </div>
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
