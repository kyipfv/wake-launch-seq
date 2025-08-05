import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Wake Launch
            <span className="block text-primary">Sequence</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Optimize your wake-up performance with bio-hacker precision.
            Track reaction times, mood, and circadian alignment.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/sign-up"
            className="block w-full bg-primary hover:bg-blue-400 text-black font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Start Your Launch Sequence
          </Link>
          
          <Link
            href="/sign-in"
            className="block w-full border border-primary text-primary hover:bg-primary hover:text-black font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Mission Control Login
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-primary font-semibold mb-2">Chronotype Analysis</h3>
            <p className="text-gray-300 text-sm">
              Evidence-based assessment to determine your optimal wake window
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-primary font-semibold mb-2">Performance Metrics</h3>
            <p className="text-gray-300 text-sm">
              Track reaction times and alertness with precision measurements
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-primary font-semibold mb-2">Light Optimization</h3>
            <p className="text-gray-300 text-sm">
              Sunrise-synchronized recommendations for circadian alignment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}