"use client"

import { Truck, Package, BarChart3, Warehouse } from "lucide-react"

export default function SupplyChainAnimation() {
  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading text-blue-900">
            Our End-to-End Supply Chain Solution
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            From warehouse to delivery, our integrated platform streamlines every step of your logistics operations.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="relative flex items-center justify-between max-w-6xl mx-auto">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 via-yellow-400 to-orange-500 transform -translate-y-1/2 origin-left rounded-full"></div>

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
                  <div
                    key={step.title}
                    className="relative flex flex-col items-center text-center group"
                    style={{ zIndex: 10 }}
                  >
                    {/* Icon Circle */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white">
                        <IconComponent className={`w-12 h-12 ${step.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-[180px]">
                      <h3 className={`text-xl font-bold mb-3 ${step.color}`}>{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>

                    {/* Step Number */}
                    <div
                      className={`absolute -top-3 -right-3 w-8 h-8 bg-${step.color === "text-blue-900" ? "blue-900" : step.color === "text-yellow-500" ? "yellow-500" : "orange-500"} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}
                    >
                      {index + 1}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
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
                <div key={step.title} className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 border-2 border-gray-100 relative">
                    <IconComponent className={`w-8 h-8 ${step.color}`} />
                  </div>

                  <h3 className={`text-lg font-bold mb-2 ${step.color}`}>{step.title}</h3>
                  <p className="text-sm text-gray-600 max-w-[280px] leading-relaxed px-4">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 font-medium leading-relaxed">
              Our integrated platform connects every step of your supply chain for maximum efficiency.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
