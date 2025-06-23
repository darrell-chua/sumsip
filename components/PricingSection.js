'use client'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      price: 399,
      companies: 2,
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 2 companies',
        'Basic transaction tracking',
        'Simple dashboard & reports',
        'Email support',
        'Mobile app access',
        'Data export (CSV)',
        '1GB storage'
      ],
      popular: false,
      cta: 'Contact to Subscribe'
    },
    {
      name: 'Professional',
      icon: Star,
      price: 599,
      companies: 4,
      description: 'Ideal for growing businesses with multiple ventures',
      features: [
        'Up to 4 companies',
        'Advanced transaction tracking',
        'Comprehensive reporting',
        'Priority email support',
        'Advanced categorization',
        'Data export (CSV, PDF, Excel)',
        '5GB storage',
        'Custom date ranges',
        'Financial trend analysis'
      ],
      popular: true,
      cta: 'Contact to Subscribe'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 899,
      companies: 10,
      description: 'For established businesses managing multiple companies',
      features: [
        'Up to 10 companies',
        'Full transaction management',
        'Custom reporting & analytics',
        'Phone & email support',
        'Multi-user access (up to 5 users)',
        'API access',
        'Unlimited storage',
        'Advanced security features',
        'Data backup & restore',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false,
      cta: 'Contact to Subscribe'
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide animate-fade-in">
            Pricing Plans
          </h2>
          <h3 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl animate-fade-in delay-100">
            Choose the Perfect Plan for Your Business
          </h3>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in delay-200">
            Contact us to subscribe and get your account credentials.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in-up ${
                  plan.popular 
                    ? 'ring-2 ring-indigo-600 scale-105 lg:scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                      plan.popular 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        RM{plan.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600">/year</span>
                      <div className="text-sm text-gray-500 mt-1">
                        RM{Math.round(plan.price / 12).toLocaleString()}/month when billed annually
                      </div>
                    </div>

                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                      plan.popular 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      Up to {plan.companies} {plan.companies === 1 ? 'company' : 'companies'}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center animate-fade-in delay-600">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h4>
            <p className="text-gray-600 mb-6">
              Ready to get started? Contact us to discuss your needs and get your account set up.
              We'll provide you with login credentials once your subscription is confirmed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                View Full Feature Comparison
              </Button>
              <Button size="lg">
                Contact Sales Team
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">Instant</div>
              <div className="text-gray-600">Account Setup</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">Secure</div>
              <div className="text-gray-600">Data Protection</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}