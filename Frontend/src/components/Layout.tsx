import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
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
              <Link 
                to="/profile" 
                className={`transition-colors ${
                  isActive('/profile') 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Profile
              </Link>
            </div>
            
            <button className="bg-white text-slate-900 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}