'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    body: "SumSip has completely transformed how I manage my business finances. The dashboard gives me a clear picture of my financial health at a glance.",
    author: {
      name: 'Emma Rodriguez',
      role: 'Founder, Design Studio',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: "As someone who manages multiple businesses, SumSip's multi-company feature has been a game-changer. I can switch between companies with ease.",
    author: {
      name: 'Michael Chen',
      role: 'Serial Entrepreneur',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: "The reporting features help me understand where my money is going and make better financial decisions. SumSip has paid for itself many times over.",
    author: {
      name: 'Sarah Johnson',
      role: 'CFO, Tech Startup',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: "I've tried many accounting tools, but SumSip is by far the most intuitive and powerful. It's helped me save hours every month on financial management.",
    author: {
      name: 'David Kim',
      role: 'Freelance Developer',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: "The customer support team at SumSip is exceptional. They've helped me customize the system to perfectly fit my business needs.",
    author: {
      name: 'Olivia Martinez',
      role: 'Owner, Retail Chain',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: "I appreciate how SumSip grows with my business. I started with the Starter plan and upgraded as my needs increased. It's been a valuable partner in my growth.",
    author: {
      name: 'James Wilson',
      role: 'Small Business Owner',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={ref} className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by businesses everywhere
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See what our customers have to say about how SumSip has helped them manage their finances.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={index}
              className="relative isolate flex flex-col justify-between rounded-2xl bg-gray-50 px-8 py-10 shadow-sm sm:p-10"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-6 flex items-center gap-x-4">
                <Image
                  className="h-14 w-14 rounded-full bg-gray-50"
                  src={testimonial.author.image}
                  alt=""
                  width={56}
                  height={56}
                />
                <div className="text-sm leading-6">
                  <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                  <div className="text-gray-600">{testimonial.author.role}</div>
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-gray-600">
                  <blockquote className="text-base leading-relaxed">
                    "{testimonial.body}"
                  </blockquote>
                </div>
              </div>
              <svg
                className="absolute right-6 top-6 text-gray-200 h-8 w-8"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}