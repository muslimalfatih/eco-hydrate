'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: "♻️",
    title: "100% Recycled Materials",
    description: "Made from post-consumer recycled plastic, giving waste a second life."
  },
  {
    icon: "💧",
    title: "BPA-Free & Safe",
    description: "Food-grade materials ensure your water stays pure and healthy."
  },
  {
    icon: "🌍",
    title: "Carbon Neutral",
    description: "Every bottle sold plants a tree and offsets manufacturing emissions."
  },
  {
    icon: "🔄",
    title: "Lifetime Warranty",
    description: "Built to last with a commitment to replace any defective bottles."
  }
]

export function FeaturesSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background pattern with parallax */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ y }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100 to-blue-100" />
      </motion.div>

      <motion.div 
        className="max-w-6xl mx-auto px-4"
        style={{ opacity }}
      >
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Why Choose Eco-Hydrate?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Every bottle makes a difference. Join thousands who've already made the switch.
          </motion.p>
        </motion.div>

        {/* Features grid with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 400 }
              }}
            >
              <motion.div 
                className="text-4xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2 + 0.3,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {feature.icon}
              </motion.div>
              
              <motion.h3 
                className="text-xl font-semibold text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
              >
                {feature.title}
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
