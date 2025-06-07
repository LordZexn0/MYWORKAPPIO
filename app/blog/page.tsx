"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import LoadingScreen from "@/components/loading-screen"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Supply Chain Management: 5 Trends to Watch in 2024",
    excerpt:
      "Discover the emerging technologies and strategies that are reshaping supply chain operations and how your business can stay ahead of the curve.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Supply Chain",
    image: "/images/blog-1.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "How IoT Sensors Are Revolutionizing Warehouse Operations",
    excerpt:
      "Learn how Internet of Things technology is providing unprecedented visibility and control over warehouse processes.",
    author: "Michael Chen",
    date: "March 10, 2024",
    readTime: "6 min read",
    category: "IoT Technology",
    image: "/images/blog-2.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Digital Transformation in Logistics: A Complete Guide",
    excerpt:
      "A comprehensive look at how digital technologies are transforming logistics operations and what it means for your business.",
    author: "Emily Rodriguez",
    date: "March 5, 2024",
    readTime: "12 min read",
    category: "Digital Transformation",
    image: "/images/blog-3.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Reducing Operational Costs Through Automation",
    excerpt:
      "Practical strategies for implementing automation in your operations to reduce costs and improve efficiency.",
    author: "David Kim",
    date: "February 28, 2024",
    readTime: "7 min read",
    category: "Automation",
    image: "/images/blog-4.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Best Practices for Implementing Turnkey Solutions",
    excerpt: "Essential tips and strategies for successfully implementing turnkey solutions in your organization.",
    author: "Lisa Thompson",
    date: "February 22, 2024",
    readTime: "9 min read",
    category: "Implementation",
    image: "/images/blog-5.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "The ROI of Digital Warehouse Management Systems",
    excerpt: "Understanding the financial benefits and return on investment of modern warehouse management solutions.",
    author: "Robert Wilson",
    date: "February 15, 2024",
    readTime: "10 min read",
    category: "ROI Analysis",
    image: "/images/blog-6.jpg",
    featured: false,
  },
]

const categories = [
  "All",
  "Supply Chain",
  "IoT Technology",
  "Digital Transformation",
  "Automation",
  "Implementation",
  "ROI Analysis",
]

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true)
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[#0F4C81]">Industry Insights</h1>
              <p className="text-xl text-gray-600 mb-8">
                Stay ahead with the latest trends, best practices, and insights in logistics, warehouse management, and
                digital transformation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4" />
                      <p>Featured Article Image</p>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="px-3 py-1 bg-[#FF6B35] text-white text-sm font-medium rounded-full">Featured</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4 text-[#0F4C81]">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>

                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>

                  <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-3 rounded-none">
                    <Link href={`/blog/${featuredPost.id}`} className="flex items-center">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="py-8 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className={`rounded-full ${
                    category === "All"
                      ? "bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
                      : "border-gray-300 text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35]"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 hover:border-[#FFCF40] transition-colors group"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="bg-gray-100 aspect-video flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Article Image</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <span className="px-3 py-1 bg-[#FFCF40]/20 text-[#FF6B35] text-xs font-medium rounded-full">
                        {post.category}
                      </span>

                      <h3 className="text-xl font-bold mt-4 mb-3 text-[#0F4C81] group-hover:text-[#FF6B35] transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          className="text-[#FF6B35] hover:text-[#FF6B35]/80 p-0 h-auto font-medium"
                        >
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-[#0F4C81] to-[#FF6B35]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Stay Updated with Industry Insights</h2>
              <p className="text-xl text-white/90 mb-8">
                Get the latest articles, trends, and best practices delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-none border-0 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button className="bg-white text-[#0F4C81] hover:bg-gray-100 px-6 py-3 rounded-none font-medium">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
