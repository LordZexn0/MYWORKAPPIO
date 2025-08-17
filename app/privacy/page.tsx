"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import LoadingScreen from "@/app/loading-screen"

export default function PrivacyPolicyPage() {
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
      <AnimatePresence>
        {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      </AnimatePresence>
      <Navigation />

      <main className="pt-16 bg-white text-gray-900">
        {/* Hero */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[#0F4C81]">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600">
                Your privacy matters. This page explains what data we collect, how we use it, and your rights.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                We collect only the information necessary to provide and improve our services. We do not sell your
                personal data. We are committed to transparency and security.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Information We Collect</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Contact details you provide (e.g., name, email, phone) via forms</li>
                <li>Usage data such as pages visited, device/browser type, and interactions</li>
                <li>Communication records when you contact us for support or inquiries</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">How We Use Information</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>To operate, maintain, and improve our website and services</li>
                <li>To respond to inquiries and provide customer support</li>
                <li>To send service-related communications (you may opt out of non-essential messages)</li>
                <li>To protect against, identify, and prevent fraud or misuse</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Data Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell your personal information. We may share data with trusted service providers who support
                our operations (e.g., hosting, analytics) under strict confidentiality and data processing agreements.
                We may also disclose information if required by law or to protect our rights.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement administrative, technical, and physical safeguards designed to protect your information.
                While no method of transmission over the Internet is 100% secure, we continuously improve our practices.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                You may request access, correction, or deletion of your personal data where applicable. To exercise
                these rights, contact us using the information below.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at
                {" "}
                <a className="text-[#FF6B35] hover:underline" href="mailto:hello@myworkapp.io">
                  hello@myworkapp.io
                </a>
                .
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}


