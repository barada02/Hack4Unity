export default function CulturalDiscovery() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Cultural Discovery</h1>
        <p className="text-slate-400 text-lg">
          Explore connections and similarities between any two cultures
        </p>
      </div>

      {/* Country Selection */}
      <div className="bg-slate-900 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Compare Cultures</h2>
        
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Country 1 */}
          <div>
            <label className="block text-sm font-medium mb-3">First Country</label>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-slate-600 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-6 bg-gradient-to-r from-orange-500 to-green-500 rounded"></div>
                <span>Select Country</span>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <span className="text-slate-400 text-sm font-medium">VS</span>
            </div>
          </div>

          {/* Country 2 */}
          <div>
            <label className="block text-sm font-medium mb-3">Second Country</label>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-slate-600 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-6 bg-gradient-to-r from-red-500 to-white rounded"></div>
                <span>Select Country</span>
              </div>
            </div>
          </div>
        </div>

        <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity mt-6 w-full md:w-auto">
          Discover Connections
        </button>
      </div>

      {/* Results Placeholder */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
            Similarities
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800 h-4 rounded animate-pulse"></div>
            <div className="bg-slate-800 h-4 rounded animate-pulse w-3/4"></div>
            <div className="bg-slate-800 h-4 rounded animate-pulse w-1/2"></div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
            Cultural Insights
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800 h-4 rounded animate-pulse"></div>
            <div className="bg-slate-800 h-4 rounded animate-pulse w-2/3"></div>
            <div className="bg-slate-800 h-4 rounded animate-pulse w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  )
}