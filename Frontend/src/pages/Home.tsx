import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function Home() {
  const { isAuthenticated, profile } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
      {/* Hero Section */}
      <div className="text-center mb-32">
        {isAuthenticated && profile ? (
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            Welcome back,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {" "}{profile.displayName}
            </span>
          </h1>
        ) : (
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
            Connect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {" "}cultures
            </span>
          </h1>
        )}
        
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          {isAuthenticated 
            ? "Continue your journey of cultural discovery and creative collaboration."
            : "Discover connections between cultures, create meaningful artifacts, and build unity through understanding."
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <Link 
                to="/cultural"
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Explore Cultures
              </Link>
              <Link 
                to="/showcase"
                className="border border-slate-700 px-6 py-2.5 rounded-lg font-medium hover:border-slate-600 transition-colors"
              >
                Create Artifacts
              </Link>
              {!profile && (
                <Link 
                  to="/profile/setup"
                  className="bg-slate-800 hover:bg-slate-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Complete Profile
                </Link>
              )}
            </>
          ) : (
            <>
              <Link 
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
              <Link 
                to="/cultural"
                className="border border-slate-700 px-6 py-2.5 rounded-lg font-medium hover:border-slate-600 transition-colors"
              >
                View Showcase
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-12">
        <Link to="/cultural" className="text-center group">
          <div className="w-10 h-10 bg-slate-800 group-hover:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </div>
          <h3 className="font-semibold mb-2">Cultural Discovery</h3>
          <p className="text-sm text-slate-400">Find connections between any cultures</p>
        </Link>

        <Link to="/showcase" className="text-center group">
          <div className="w-10 h-10 bg-slate-800 group-hover:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          </div>
          <h3 className="font-semibold mb-2">Creative Showcase</h3>
          <p className="text-sm text-slate-400">Generate and share unity artifacts</p>
        </Link>

        <Link to="/profile" className="text-center group">
          <div className="w-10 h-10 bg-slate-800 group-hover:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <h3 className="font-semibold mb-2">Global Network</h3>
          <p className="text-sm text-slate-400">Connect with like-minded people</p>
        </Link>
      </div>
    </div>
  )
}