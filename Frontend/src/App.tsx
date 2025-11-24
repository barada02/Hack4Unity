function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded"></div>
              <span className="font-medium">Unity Hub</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cultural</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Showcase</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Profile</a>
            </div>
            <button className="bg-white text-slate-900 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
          Connect
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {" "}cultures
          </span>
        </h1>
        
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          Discover connections between cultures, create meaningful artifacts, 
          and build unity through understanding.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Start Exploring
          </button>
          <button className="border border-slate-700 px-6 py-2.5 rounded-lg font-medium hover:border-slate-600 transition-colors">
            View Demo
          </button>
        </div>
      </main>

      {/* Features - Minimal */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2">Cultural Discovery</h3>
            <p className="text-sm text-slate-400">Find connections between any cultures</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2">Creative Showcase</h3>
            <p className="text-sm text-slate-400">Generate and share unity artifacts</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2">Global Network</h3>
            <p className="text-sm text-slate-400">Connect with like-minded people</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
