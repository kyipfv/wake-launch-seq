import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Apple Health Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 opacity-5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <div className="text-6xl text-white">⚡</div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            Wake Launch
            <br />
            <span className="text-blue-600">Sequence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
            Bio-hacker wake optimization with precision performance tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/sign-up" className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-bold rounded-3xl hover:shadow-xl hover:scale-105 transition-all duration-200 shadow-lg">
              🚀 Launch Sequence
            </Link>
            <Link href="/sign-in" className="px-12 py-4 bg-white border-2 border-blue-600 text-blue-600 text-xl font-bold rounded-3xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section 1 - Reaction Speed */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="text-blue-600 text-base font-bold mb-6">REACTION SPEED TRACKING</div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Lightning Fast
                <br />
                <span className="text-blue-600">Precision</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                Laboratory-grade reaction time measurement. Track how your morning routine impacts mental agility and response speed.
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg relative z-10">
                  <div className="text-5xl text-white">⚡</div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 relative z-10">247<span className="text-xl text-gray-600 ml-1">ms</span></div>
                <div className="text-base text-gray-600 font-medium relative z-10">Average Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Alertness */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-lg relative z-10">
                  <div className="text-5xl text-white">🧠</div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 relative z-10">8.5<span className="text-xl text-gray-600 ml-1">/10</span></div>
                <div className="text-base text-gray-600 font-medium relative z-10">Energy Level</div>
              </div>
            </div>
            <div className="text-center lg:text-right order-1 lg:order-2">
              <div className="text-green-600 text-base font-bold mb-6">ALERTNESS MONITORING</div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Peak Energy
                <br />
                <span className="text-green-600">Tracking</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                Daily mood and alertness monitoring reveals patterns in your wake performance over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Circadian */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="text-orange-600 text-base font-bold mb-6">CIRCADIAN OPTIMIZATION</div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Sunrise Sync
                <br />
                <span className="text-orange-600">Precision</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                AI-powered light therapy guidance based on your location and chronotype for optimal circadian alignment.
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-lg relative z-10">
                  <div className="text-5xl text-white">☀️</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 relative z-10">6:24 AM</div>
                <div className="text-base text-gray-600 mb-4 font-medium relative z-10">Tomorrow's Sunrise</div>
                <div className="inline-block px-4 py-2 bg-orange-100 rounded-2xl text-orange-700 font-semibold text-sm relative z-10">
                  🚶‍♂️ Outdoor walk recommended
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Performance tracking that matters
            </h2>
            <p className="text-lg text-gray-600 font-medium">Comprehensive bio-hacker metrics for optimal wake performance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-5 rounded-full -translate-y-2 translate-x-2"></div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                <div className="text-2xl text-white">📊</div>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-3 relative z-10">14</div>
              <div className="text-base text-gray-600 font-medium relative z-10">Day trend analysis</div>
            </div>
            
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-5 rounded-full -translate-y-2 translate-x-2"></div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                <div className="text-2xl text-white">⚡</div>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-3 relative z-10">10</div>
              <div className="text-base text-gray-600 font-medium relative z-10">Reaction time tests</div>
            </div>
            
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 opacity-5 rounded-full -translate-y-2 translate-x-2"></div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                <div className="text-2xl text-white">🧠</div>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-3 relative z-10">5</div>
              <div className="text-base text-gray-600 font-medium relative z-10">Chronotype questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="mb-12">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <div className="text-4xl text-white">🚀</div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Ready to optimize your mornings?
          </h2>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join the bio-hacker community tracking wake performance with laboratory-grade precision.
          </p>
          
          <Link href="/sign-up" className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-bold rounded-3xl hover:shadow-xl hover:scale-105 transition-all duration-200 shadow-lg">
            🚀 Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}