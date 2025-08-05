import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-900"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/20 via-transparent to-cyan-500/20"></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-2xl">
              <div className="text-4xl">⚡</div>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 leading-none">
            Wake
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Launch
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Bio-hacker wake optimization.<br />
            <span className="text-blue-400">Precision performance tracking.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/sign-up" className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Launch Sequence
            </Link>
            <Link href="/sign-in" className="px-10 py-4 border-2 border-white/30 text-white text-xl font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section 1 - Reaction Speed */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="text-blue-600 text-lg font-semibold mb-4">REACTION SPEED</div>
              <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Lightning
                <br />
                <span className="text-blue-600">Fast</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Laboratory-grade reaction time measurement. Track how your morning routine impacts mental agility and response speed.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 text-center shadow-2xl">
                <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="text-8xl">⚡</div>
                </div>
                <div className="text-6xl font-bold text-gray-900 mb-4">247<span className="text-3xl text-gray-600">ms</span></div>
                <div className="text-xl text-gray-600">Average Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Alertness */}
      <section className="py-32 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 text-center shadow-2xl border border-gray-700">
                <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="text-8xl">😊</div>
                </div>
                <div className="text-6xl font-bold text-white mb-4">8.5<span className="text-3xl text-gray-400">/10</span></div>
                <div className="text-xl text-gray-400">Energy Level</div>
              </div>
            </div>
            <div className="text-center lg:text-right order-1 lg:order-2">
              <div className="text-green-400 text-lg font-semibold mb-4">ALERTNESS TRACKING</div>
              <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Peak
                <br />
                <span className="text-green-400">Energy</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Daily mood and alertness monitoring reveals patterns in your wake performance over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Circadian */}
      <section className="py-32 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="text-orange-600 text-lg font-semibold mb-4">CIRCADIAN OPTIMIZATION</div>
              <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Sunrise
                <br />
                <span className="text-orange-600">Sync</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI-powered light therapy guidance based on your location and chronotype for optimal circadian alignment.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-12 text-center shadow-2xl">
                <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="text-8xl">☀️</div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-4">6:24 AM</div>
                <div className="text-xl text-gray-600 mb-6">Tomorrow's Sunrise</div>
                <div className="inline-block px-6 py-3 bg-orange-200 rounded-full text-orange-800 font-semibold">
                  🚶‍♂️ Outdoor walk recommended
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Performance tracking
              <br />
              <span className="text-blue-600">that matters</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-3xl">📊</div>
              </div>
              <div className="text-7xl font-bold text-blue-600 mb-4">14</div>
              <div className="text-2xl text-gray-600">Day trend analysis</div>
            </div>
            
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-3xl">⚡</div>
              </div>
              <div className="text-7xl font-bold text-green-600 mb-4">10</div>
              <div className="text-2xl text-gray-600">Reaction time tests</div>
            </div>
            
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <div className="text-3xl">🧠</div>
              </div>
              <div className="text-7xl font-bold text-orange-600 mb-4">5</div>
              <div className="text-2xl text-gray-600">Chronotype questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 mb-8 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 shadow-2xl">
              <div className="text-6xl">🚀</div>
            </div>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Ready to optimize
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              your mornings?
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            Join the bio-hacker community tracking wake performance with laboratory-grade precision.
          </p>
          
          <Link href="/sign-up" className="inline-block px-12 py-5 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 text-white text-2xl font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}