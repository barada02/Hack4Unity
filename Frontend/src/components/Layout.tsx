import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function Layout() {
  const location = useLocation()
  const { isAuthenticated, profile, isLoading } = useAuth()
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded"></div>
              <span className="font-medium">Unity Hub</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Main Navigation */}
              <div className="hidden md:flex space-x-8 text-sm">
                <Link 
                  to="/cultural" 
                  className={`transition-colors ${
                    isActive('/cultural') 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cultural
                </Link>
                <Link 
                  to="/showcase" 
                  className={`transition-colors ${
                    isActive('/showcase') 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Showcase
                </Link>
              </div>

              {/* Auth Section */}
              {isLoading ? (
                <div className="w-8 h-8 bg-slate-800 rounded-full animate-pulse"></div>
              ) : isAuthenticated ? (
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {getInitials(profile?.displayName)}
                  </div>
                  <span className="hidden sm:block text-sm">
                    {profile?.displayName || 'Profile'}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center space-x-3 text-sm">
                  <Link 
                    to="/login"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isAuthenticated && (
            <div className="md:hidden flex justify-center space-x-8 py-3 border-t border-slate-800">
              <Link 
                to="/cultural" 
                className={`text-sm transition-colors ${
                  isActive('/cultural') 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cultural
              </Link>
              <Link 
                to="/showcase" 
                className={`text-sm transition-colors ${
                  isActive('/showcase') 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Showcase
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}