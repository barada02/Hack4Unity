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
            Create & Share
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {" "}Unity Artifacts
            </span>
          </h1>
        )}
        
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          {isAuthenticated 
            ? "Create beautiful mathematical visualizations and share them with the world."
            : "Generate stunning mathematical art using Wolfram Language, share with the community, and explore creativity through code."
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <Link 
                to="/create"
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Create Artifact
              </Link>
              <Link 
                to="/showcase"
                className="border border-slate-700 px-6 py-2.5 rounded-lg font-medium hover:border-slate-600 transition-colors"
              >
                Explore Gallery
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

      {/* Current Features */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Available Now</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <Link to="/create" className="text-center group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
              <span className="text-xl">🎨</span>
            </div>
            <h3 className="font-semibold mb-2 text-lg">Artifact Generation</h3>
            <p className="text-sm text-slate-400 mb-2">Create stunning mathematical visualizations using Wolfram Language</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-500/30">
              ✓ Live
            </span>
          </Link>

          <Link to="/showcase" className="text-center group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
              <span className="text-xl">🌟</span>
            </div>
            <h3 className="font-semibold mb-2 text-lg">Community Showcase</h3>
            <p className="text-sm text-slate-400 mb-2">Share your creations and discover amazing artifacts from others</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-500/30">
              ✓ Live
            </span>
          </Link>
        </div>
      </div>

      {/* Upcoming Features */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Coming Soon</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group opacity-60">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🌍</span>
            </div>
            <h3 className="font-semibold mb-2">Cultural Discovery</h3>
            <p className="text-sm text-slate-400 mb-2">Find connections between cultures worldwide</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-900/30 text-orange-400 border border-orange-500/30">
              🚧 In Development
            </span>
          </div>

          <div className="text-center group opacity-60">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="font-semibold mb-2">Global Network</h3>
            <p className="text-sm text-slate-400 mb-2">Connect with like-minded creators worldwide</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-900/30 text-orange-400 border border-orange-500/30">
              🚧 In Development
            </span>
          </div>

          <div className="text-center group opacity-60">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">AI Insights</h3>
            <p className="text-sm text-slate-400 mb-2">Get personalized cultural connections and insights</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-900/30 text-orange-400 border border-orange-500/30">
              🚧 Planned
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}