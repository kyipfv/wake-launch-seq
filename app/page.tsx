import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-3xl mb-8 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L13.09 8.26L19 7.27L14.18 11.97L20 16.64L13.83 14.18L12 21L10.17 14.18L4 16.64L9.82 11.97L5 7.27L10.91 8.26L12 2Z" 
                      fill="currentColor"/>
              </svg>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Wake Launch
              <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Sequence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Optimize your wake-up performance with precision tracking.
              <span className="block mt-2">Monitor reaction times, alertness, and circadian alignment.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-16">
            <Link
              href="/sign-up"
              className="apple-button-primary flex-1 text-center"
            >
              Get Started
            </Link>
            
            <Link
              href="/sign-in"
              className="apple-button-secondary flex-1 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-header">Built for Performance</h2>
            <p className="section-subheader">Evidence-based tools for optimizing your morning routine</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="health-card-large text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                        fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Chronotype Analysis
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Scientific assessment to determine your optimal wake window based on circadian research
              </p>
            </div>
            
            <div className="health-card-large text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" 
                        fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Performance Metrics
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Track reaction times and alertness levels with precision measurements and trend analysis
              </p>
            </div>
            
            <div className="health-card-large text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                  <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" 
                        fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Light Optimization
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Sunrise-synchronized recommendations for optimal circadian rhythm alignment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to optimize your mornings?
            </h3>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              Join the precision wake-up revolution
            </p>
            <Link
              href="/sign-up"
              className="apple-button-primary inline-block"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}