"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Testimonial {
  id: string
  clientName: string
  content: string
  rating: number
  projectReference?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  interval?: number
}

export default function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1 || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, testimonials.length, isPaused, currentIndex])

  const handlePrevious = useCallback(() => {
    setIsPaused(true)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsPaused(false), 5000)
  }, [testimonials.length])

  const handleNext = useCallback(() => {
    setIsPaused(true)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsPaused(false), 5000)
  }, [testimonials.length])

  const handleDotClick = useCallback((index: number) => {
    setIsPaused(true)
    setCurrentIndex(index)
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsPaused(false), 5000)
  }, [])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-foreground)] mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
            La satisfaction de nos clients est notre plus grande réussite
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative px-4 md:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-100 rounded-2xl p-6 md:p-12 shadow-lg"
            >
              <div className="flex justify-center mb-6 gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 md:w-6 md:h-6 ${
                      i < currentTestimonial.rating ? "text-[var(--color-primary)] fill-current" : "text-neutral-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p className="text-lg md:text-2xl text-center mb-8 leading-relaxed italic text-[var(--color-foreground)]">
                &ldquo;{currentTestimonial.content}&rdquo;
              </p>

              <div className="text-center">
                <p className="font-semibold text-base md:text-lg text-[var(--color-foreground)]">
                  {currentTestimonial.clientName}
                </p>
                {currentTestimonial.projectReference && (
                  <p className="text-[var(--color-muted)] text-sm mt-1">{currentTestimonial.projectReference}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center mt-8 gap-4 md:gap-6">
            <button
              onClick={handlePrevious}
              className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-primary)] p-3 md:p-4 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 touch-manipulation active:scale-95"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2 md:gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 md:h-3 rounded-full transition-all touch-manipulation active:scale-95 ${
                    index === currentIndex
                      ? "bg-[var(--color-primary)] w-8 md:w-10"
                      : "bg-neutral-300 hover:bg-[var(--color-primary)]/50 w-2.5 md:w-3"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-primary)] p-3 md:p-4 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 touch-manipulation active:scale-95"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
