"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Clock, Shield, Users, Zap, Award } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LoadingScreen from "@/app/loading-screen"

const reasons = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Turnkey Solutions",
    description:
      "Complete, ready-to-use systems that work from day one. No complex setup or lengthy development cycles.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Rapid Deployment",
    description:
      "Get up and running in weeks, not months. Our solutions are designed for quick implementation and immediate results.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Proven Reliability",
    description: "Battle-tested systems with 99.9% uptime. Your operations stay running smoothly, 24/7.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Expert Support",
    description:
      "Dedicated support team with deep industry knowledge. We're here to help you succeed every step of the way.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Industry Leading",
    description: "Cutting-edge technology and best practices from years of experience across multiple industries.",
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Guaranteed Results",
    description: "We stand behind our solutions with measurable outcomes and performance guarantees.",
  },
]

const stats = [
  { number: "500+", label: "Successful Projects", color: "text-[#FF6B35]" },
  { number: "99%", label: "Client Satisfaction", color: "text-[#FFCF40]" },
  { number: "50%", label: "Average Efficiency Gain", color: "text-[#0F4C81]" },
  { number: "24/7", label: "Support Available", color: "text-[#FF6B35]" },
]

export default function WhyUsPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Prevent scrolling during loading
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
      <AnimatePresence>{isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}</AnimatePresence>
      <Navigation />

      <main className="pt-16 bg-white text-gray-900">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[#0F4C81]">
                Why Choose MyWorkApp.io?
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We don't just build software – we deliver complete solutions that transform your business operations
                from day one.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                  <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reasons Section */}
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-[#0F4C81]">What Sets Us Apart</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We combine deep industry expertise with cutting-edge technology to deliver solutions that actually work.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 border border-gray-200 hover:border-[#FFCF40] transition-colors"
                >
                  <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-6 text-[#FF6B35]">
                    {reason.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-[#0F4C81]">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-[#0F4C81]">Our Proven Process</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From consultation to deployment, we ensure your success every step of the way.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Consultation",
                  description: "We analyze your needs and design the perfect solution",
                },
                {
                  step: "02",
                  title: "Configuration",
                  description: "We customize our turnkey platform to your requirements",
                },
                {
                  step: "03",
                  title: "Deployment",
                  description: "Quick implementation with minimal disruption to operations",
                },
                {
                  step: "04",
                  title: "Support",
                  description: "Ongoing support and optimization to ensure continued success",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-[#FF6B35] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#0F4C81]">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-[#0F4C81] to-[#FF6B35]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Experience the Difference?</h2>
              <p className="text-xl text-white/90 mb-8">
                Join hundreds of companies that have transformed their operations with our turnkey solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-white text-[#0F4C81] hover:bg-gray-100 px-8 py-4 rounded-none font-medium">
                    Get Free Consultation
                  </Button>
                </Link>
                <Link href="/case-studies">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#0F4C81] px-8 py-4 rounded-none"
                  >
                    View Success Stories
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
