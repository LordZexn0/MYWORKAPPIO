"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import LoadingScreen from "@/app/loading-screen"

export default function TermsOfServicePage() {
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
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600">
                Please read these terms carefully before using our services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our website and services, you agree to be bound by these Terms of Service and our
                Privacy Policy. If you do not agree to these terms, you may not use our services.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Use of Services</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You agree to use the services only for lawful purposes</li>
                <li>You will not engage in activities that disrupt or harm the platform or other users</li>
                <li>You are responsible for the accuracy of information you provide</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content, trademarks, logos, and other intellectual property displayed on the site are the property of
                their respective owners and are protected by applicable laws. You may not use any materials without prior
                written consent.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Disclaimers</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are provided on an "as is" and "as available" basis. We disclaim all warranties of any kind,
                whether express or implied, including but not limited to implied warranties of merchantability, fitness for
                a particular purpose, and non-infringement.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of your use or inability to use our services.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms from time to time. Material changes will be posted on this page with an updated
                effective date. Your continued use of the services constitutes acceptance of the updated terms.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <h2 className="text-2xl font-bold text-[#0F4C81] mb-3">Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about these Terms, contact us at
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


