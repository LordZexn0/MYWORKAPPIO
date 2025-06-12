"use client"

import { Truck, Package, BarChart3, Warehouse } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function SupplyChainAnimation() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
  }

  const lineVariants = {
    hidden: { 
      scaleX: 0,
      opacity: 0 
    },
    visible: { 
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
        delay: 0.5
      }
    },
  }

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading text-blue-900">
            Our End-to-End Supply Chain Solution
          </h2>
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            From warehouse to delivery, our integrated platform streamlines every step of your logistics operations.
          </p>
        </motion.div>

        <div className="relative" ref={containerRef}>
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="relative flex items-center justify-between max-w-6xl mx-auto">
              {/* Connecting Line */}
              <motion.div 
                className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 via-yellow-400 to-orange-500 transform -translate-y-1/2 origin-left rounded-full"
                variants={lineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              />

              <motion.div 
                className="flex items-center justify-between w-full"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {[
                  {
                    icon: Warehouse,
                    title: "Warehouse",
                    description: "Inventory tracking and management",
                    color: "text-blue-900",
                  },
                  {
                    icon: Package,
                    title: "Packaging",
                    description: "Automated order processing",
                    color: "text-yellow-500",
                  },
                  {
                    icon: Truck,
                    title: "Shipping",
                    description: "Real-time tracking and routing",
                    color: "text-orange-500",
                  },
                  {
                    icon: BarChart3,
                    title: "Analytics",
                    description: "Performance insights and reporting",
                    color: "text-blue-900",
                  },
                ].map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <motion.div
                      key={step.title}
                      className="relative flex flex-col items-center text-center group"
                      style={{ zIndex: 10 }}
                      variants={itemVariants}
                    >
                      {/* Icon Circle */}
                      <div className="relative mb-6">
                        <motion.div 
                          className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white"
                          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        >
                          <IconComponent className={`w-12 h-12 ${step.color}`} />
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="max-w-[180px]">
                        <h3 className={`text-xl font-bold mb-3 ${step.color}`}>{step.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                      </div>

                      {/* Step Number */}
                      <motion.div
                        className="absolute -top-3 -right-3 w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                        style={{ 
                          backgroundColor: step.color === "text-blue-900" ? "#0F4C81" : 
                                         step.color === "text-yellow-500" ? "#FFCF40" : 
                                         "#FF6B35",
                          color: step.color === "text-yellow-500" ? "#000000" : "#FFFFFF"
                        }}
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {index + 1}
                      </motion.div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>

          {/* Mobile Layout */}
          <motion.div 
            className="lg:hidden space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {[
              {
                icon: Warehouse,
                title: "Warehouse",
                description: "Inventory tracking and management",
                color: "text-blue-900",
              },
              {
                icon: Package,
                title: "Packaging",
                description: "Automated order processing",
                color: "text-yellow-500",
              },
              {
                icon: Truck,
                title: "Shipping",
                description: "Real-time tracking and routing",
                color: "text-orange-500",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Performance insights and reporting",
                color: "text-blue-900",
              },
            ].map((step, index) => {
              const IconComponent = step.icon
              return (
                <motion.div 
                  key={step.title} 
                  className="flex flex-col items-center text-center relative"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 border-2 border-gray-100 relative"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <IconComponent className={`w-8 h-8 ${step.color}`} />
                  </motion.div>

                  <h3 className={`text-lg font-bold mb-2 ${step.color}`}>{step.title}</h3>
                  <p className="text-sm text-gray-600 max-w-[280px] leading-relaxed px-4">{step.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 font-medium leading-relaxed">
              Our integrated platform connects every step of your supply chain for maximum efficiency.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
