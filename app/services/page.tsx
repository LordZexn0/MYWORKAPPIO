"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import LoadingScreen from "@/app/loading-screen"
import { useCMS } from "@/hooks/use-cms"

export default function ServicesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { content } = useCMS()
  const { hero, items: services, cta } = content.services

  const currentService = services[currentIndex]

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handlePrevious = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? services.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === services.length - 1 ? 0 : prevIndex + 1))
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}</AnimatePresence>
      <Navigation />

      <main className="pt-16 bg-white text-gray-900">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[#0F4C81]">{hero.title}</h1>
            <p className="text-xl text-gray-600 mb-8">
              {hero.description}
            </p>
          </div>
        </section>

        {/* Services Showcase */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", duration: 0.5 }}
                  className="w-full"
                >
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                      <div className="bg-white p-8 md:p-12 border border-gray-200 shadow-sm">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-[#FF6B35]">
                          {currentService.title}
                        </h3>
                        <h4 className="text-xl text-[#FFCF40] mb-6">{currentService.subtitle}</h4>
                        <p className="text-gray-600 mb-8">{currentService.description}</p>

                        <div className="mb-8">
                          <h5 className="text-lg font-semibold mb-4 text-[#FF6B35]">Key Features:</h5>
                          <ul className="space-y-3">
                            {currentService.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-[#FFCF40] mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-8">
                          <h5 className="text-lg font-semibold mb-4 text-[#FF6B35]">Benefits:</h5>
                          <ul className="space-y-2">
                            {currentService.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-[#FFCF40] rounded-full mr-3"></span>
                                <span className="text-gray-600 font-medium">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link href="/contact">
                          <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-4 rounded-none">
                            Get Started with This Service
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="order-1 md:order-2 flex justify-center">
                      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                        <img
                          src={currentService.image || "/placeholder.svg"}
                          alt={currentService.title}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center items-center mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  className="rounded-none border-[#FFCF40] hover:bg-[#FFCF40]/10"
                >
                  <ChevronLeft className="h-5 w-5 text-[#FF6B35]" />
                </Button>

                <div className="flex items-center space-x-2 mx-6">
                  {services.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1)
                        setCurrentIndex(index)
                      }}
                      className={`w-3 h-3 rounded-none transition-colors ${
                        index === currentIndex ? "bg-[#FF6B35]" : "bg-[#FFCF40]"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="rounded-none border-[#FFCF40] hover:bg-[#FFCF40]/10"
                >
                  <ChevronRight className="h-5 w-5 text-[#FF6B35]" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-[#0F4C81]">{cta.title}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-4 rounded-none">
                  {cta.primaryButton}
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button
                  variant="outline"
                  className="border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white px-8 py-4 rounded-none"
                >
                  {cta.secondaryButton}
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
