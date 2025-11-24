export default function Showcase() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Creative Showcase</h1>
          <p className="text-slate-400 text-lg">
            Discover and create unity artifacts powered by AI
          </p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
          Create Artifact
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-colors">
          All
        </button>
        <button className="border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg text-sm transition-colors">
          Visual Art
        </button>
        <button className="border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg text-sm transition-colors">
          Data Viz
        </button>
        <button className="border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg text-sm transition-colors">
          Interactive
        </button>
        <button className="border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg text-sm transition-colors">
          Music
        </button>
      </div>

      {/* Artifact Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-slate-700 transition-all cursor-pointer">
            {/* Artifact Preview */}
            <div className="aspect-video bg-slate-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg opacity-50"></div>
              </div>
            </div>
            
            {/* Artifact Info */}
            <div className="p-4">
              <h3 className="font-semibold mb-2">Unity Visualization {i}</h3>
              <p className="text-sm text-slate-400 mb-3">
                An AI-generated piece exploring cultural connections...
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span>💙 24</span>
                  <span>🔄 3</span>
                  <span>💬 7</span>
                </div>
                <span className="text-xs text-slate-500">@creator{i}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="border border-slate-700 hover:border-slate-600 px-6 py-2.5 rounded-lg font-medium transition-colors">
          Load More Artifacts
        </button>
      </div>
    </div>
  )
}