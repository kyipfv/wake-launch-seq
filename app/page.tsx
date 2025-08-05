import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Apple.com Style */}
      <section className="apple-hero">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="apple-hero-title">
            Wake Launch Sequence
          </h1>
          <p className="apple-hero-subtitle">
            Precision wake optimization for peak performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up" className="apple-button apple-button-primary">
              Get Started
            </Link>
            <Link href="/sign-in" className="apple-button apple-button-secondary">
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-16 w-6 h-6 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </section>

      {/* Feature Section 1 - Minimal */}
      <section className="apple-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="apple-eyebrow">Reaction Speed</div>
              <h2 className="apple-large-text mb-6">
                Measure your reflexes with precision.
              </h2>
              <p className="apple-body-large mb-8">
                Track reaction times with laboratory-grade accuracy. 
                See how your wake-up routine affects your mental agility.
              </p>
            </div>
            <div className="apple-card text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                <div className="text-6xl font-bold text-white">⚡</div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">247ms</div>
              <div className="text-gray-600">Average Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Dark */}
      <section className="apple-section-dark">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <div className="text-blue-400 apple-eyebrow">Alertness Tracking</div>
              <h2 className="text-white apple-large-text mb-6">
                Monitor your energy levels.
              </h2>
              <p className="text-gray-300 apple-body-large mb-8">
                Daily mood and alertness tracking reveals patterns 
                in your wake performance over time.
              </p>
            </div>
            <div className="lg:order-1">
              <div className="bg-gray-800 rounded-3xl p-8 text-center shadow-2xl">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white">😊</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">8.5/10</div>
                <div className="text-gray-400">Morning Energy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Light Optimization */}
      <section className="apple-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="apple-eyebrow">Circadian Optimization</div>
              <h2 className="apple-large-text mb-6">
                Sunrise-synchronized recommendations.
              </h2>
              <p className="apple-body-large mb-8">
                AI-powered light therapy guidance based on your location 
                and chronotype for optimal circadian alignment.
              </p>
            </div>
            <div className="apple-card text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-2xl">
                <div className="text-6xl">☀️</div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">6:24 AM</div>
              <div className="text-gray-600">Tomorrow's Sunrise</div>
              <div className="mt-4 px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium">
                Outdoor walk recommended
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="apple-section bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="apple-medium-text mb-16">
            Performance tracking that matters.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-6xl font-bold text-blue-600 mb-4">14</div>
              <div className="text-xl text-gray-600">Day trend analysis</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-green-600 mb-4">10</div>
              <div className="text-xl text-gray-600">Reaction time tests</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-orange-600 mb-4">5</div>
              <div className="text-xl text-gray-600">Chronotype questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="apple-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="apple-large-text mb-6">
            Ready to optimize your mornings?
          </h2>
          <p className="apple-body-large mb-12">
            Join thousands tracking their wake performance with precision.
          </p>
          <Link href="/sign-up" className="apple-button apple-button-primary text-xl px-8 py-4">
            Start Free Today
          </Link>
        </div>
      </section>
    </div>
  );
}