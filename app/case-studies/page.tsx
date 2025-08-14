"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Calendar, MapPin, TrendingUp } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LoadingScreen from "@/app/loading-screen"
import { useCMS } from "@/hooks/use-cms"

export default function CaseStudiesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { content, isLoading: cmsLoading } = useCMS()

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

  // Use CMS data or fallback to default content
  const caseStudiesData = content.caseStudies || {
    hero: {
      title: "Success Stories",
      description: "See how our turnkey solutions have transformed operations for companies across industries."
    },
    items: [],
    stats: {
      title: "Proven Results Across Industries",
      items: []
    },
    cta: {
      title: "Ready to Write Your Success Story?",
      description: "Join these industry leaders and transform your operations with our proven turnkey solutions.",
      primaryButton: "Start Your Transformation",
      secondaryButton: "Explore Our Solutions"
    }
  }

  // Ensure items array exists
  const caseStudiesItems = caseStudiesData.items || []
  const statsItems = caseStudiesData.stats?.items || []

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}</AnimatePresence>
      <Navigation />

      <main className="pt-16 bg-white text-gray-900">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[#0F4C81]">{caseStudiesData.hero.title}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {caseStudiesData.hero.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
              {caseStudiesItems.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "md:grid-flow-col-dense" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                    <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                        <p>Case Study Image</p>
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(study.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#FFCF40]/20 text-[#FF6B35] text-sm font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#0F4C81]">{study.title}</h2>

                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {study.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {study.date}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-[#FF6B35] mb-2">Challenge:</h3>
                      <p className="text-gray-600 mb-4">{study.challenge}</p>

                      <h3 className="font-semibold text-[#FF6B35] mb-2">Solution:</h3>
                      <p className="text-gray-600 mb-4">{study.solution}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-[#FF6B35] mb-3">Key Results:</h4>
                      <ul className="space-y-2">
                        {(study.results || []).map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-[#FFCF40] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-600">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href="/contact">
                      <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-3 rounded-none">
                        Get Similar Results
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-[#0F4C81]">
                {caseStudiesData.stats.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsItems.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-[#0F4C81]">
              {caseStudiesData.cta.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {caseStudiesData.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-4 rounded-none">
                  {caseStudiesData.cta.primaryButton}
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white px-8 py-4 rounded-none"
                >
                  {caseStudiesData.cta.secondaryButton}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
