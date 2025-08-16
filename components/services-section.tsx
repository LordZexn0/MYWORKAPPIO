"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ServicesSectionProps {
  onContactClick: () => void
}

const services = [
  {
    id: 1,
    title: "Logistics and Supply Chain Management",
    subtitle: "End-to-End Visibility with a Turnkey Logistics Platform",
    description:
      "Our logistics management system is a turnkey solution designed to help businesses streamline supply chain operations without the need for complex setup or custom development. From generating and approving orders to tracking asset movement in real time, everything is built in and ready to go.",
    features: [
      "Ready-to-use tools for inbound and outbound order management",
      "Automated approval workflows",
      "Real-time tracking of inventory across the supply chain",
      "Auditable logs for compliance and transparency",
      "Immediate time and cost savings with minimal onboarding",
    ],
    image: "images/logistics.png",
  },
  {
    id: 2,
    title: "Digital Warehouse Management",
    subtitle: "Turnkey Warehouse Management, Built for Speed and Simplicity",
    description:
      "Our warehouse solution offers a comprehensive turnkey system for managing day-to-day operations—shipping, receiving, inspections, and inventory monitoring—through one unified interface. No separate modules, no integration delays—just a fast, reliable system that works from day one.",
    features: [
      "Mobile-enabled shipping and receiving",
      "Real-time inventory location and condition updates",
      "Built-in inspection workflows for asset quality",
      "Automated reporting with zero configuration",
      "Simplified asset decommissioning",
    ],
    image: "images/digitalwarehouse.png",
  },
  {
    id: 3,
    title: "IoT Sensors and Tracking",
    subtitle: "Seamless IoT Integration Through a Turnkey Tracking Platform",
    description:
      "We deliver a turnkey tracking system that incorporates RFID, barcodes, and IoT sensors for real-time asset monitoring. There's no need to piece together hardware and software—our platform comes ready to integrate with your equipment and start tracking immediately.",
    features: [
      "Plug-and-play RFID and barcode support",
      "Environmental monitoring via connected sensors",
      "Chain-of-custody tracking with full audit trails",
      "Real-time condition and location updates",
      "Scalable architecture for growing asset networks",
    ],
    image: "images/iotsensors.png",
  },
  {
    id: 4,
    title: "Custom Digital Workflow Development",
    subtitle: "Custom Workflows, Delivered as Turnkey Solutions",
    description:
      "We develop and deliver turnkey digital workflows tailored to your business processes. Whether you need a specialized inspection flow, multi-level approvals, or third-party system integration, we handle the entire build—so you can go live faster with a solution that's fully functional from day one.",
    features: [
      "Custom-configured workflows for your specific needs",
      "Fully integrated modules with no extra development required",
      "Mobile-ready forms and approval chains",
      "Smooth integration with financial and logistics platforms",
      "Easy deployment and internal adoption",
    ],
    image: "images/customdigital.png",
  },
]

export default function ServicesSection({ onContactClick }: ServicesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const currentService = services[currentIndex]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)
  }

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
    <section className="w-full min-h-screen bg-gray-50 py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading text-[#FF6B35]">Our Services</h2>
          <div className="h-px w-20 bg-[#FFCF40] mx-auto"></div>
        </motion.div>

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
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-white p-6 md:p-10 rounded-none border border-gray-200 shadow-sm">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 font-heading text-[#FF6B35]">
                      {currentService.title}
                    </h3>
                    <h4 className="text-xl text-[#FFCF40] mb-4">{currentService.subtitle}</h4>
                    <p className="text-gray-600 mb-6">{currentService.description}</p>

                    <div className="mb-6">
                      <h5 className="text-lg font-semibold mb-3 text-[#FF6B35]">What you get:</h5>
                      <ul className="space-y-2">
                        {currentService.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#FFCF40] mr-2">•</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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

          <div className="flex justify-center items-center mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-none border-[#FFCF40] hover:bg-[#FFCF40]/10"
            >
              <ChevronLeft className="h-5 w-5 text-[#FF6B35]" />
              <span className="sr-only">Previous service</span>
            </Button>

            <div className="flex items-center space-x-2 mx-4">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`w-3 h-3 rounded-none ${index === currentIndex ? "bg-[#FF6B35]" : "bg-[#FFCF40]"}`}
                  aria-label={`Go to service ${index + 1}`}
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
              <span className="sr-only">Next service</span>
            </Button>
          </div>
        </div>

        <div className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              onClick={onContactClick}
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-6 rounded-none text-lg font-medium"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
