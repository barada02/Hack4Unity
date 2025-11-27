export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Profile</h1>
        <p className="text-slate-400 text-lg">
          Manage your account and view your Unity Hub activity
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-900 rounded-xl p-8 mb-8">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold">U</span>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
            <p className="text-slate-400 mb-4">unity.explorer@email.com</p>
            <p className="text-slate-400 mb-6">Member since November 2025</p>
            
            <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
            Cultural Discoveries
          </h3>
          <div className="text-3xl font-bold mb-2">12</div>
          <p className="text-sm text-slate-400">Countries explored</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
            Artifacts Created
          </h3>
          <div className="text-3xl font-bold mb-2">8</div>
          <p className="text-sm text-slate-400">Unity creations</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            Community Impact
          </h3>
          <div className="text-3xl font-bold mb-2">145</div>
          <p className="text-sm text-slate-400">Likes received</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {[
            { type: 'cultural', text: 'Explored India vs Japan cultural connections', time: '2 hours ago' },
            { type: 'artifact', text: 'Created "Unity Mandala" visualization', time: '1 day ago' },
            { type: 'social', text: 'Liked "Peace Waves" by @artist_name', time: '2 days ago' },
            { type: 'cultural', text: 'Saved Brazil vs Nigeria comparison', time: '3 days ago' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-slate-800 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'cultural' ? 'bg-blue-500' :
                activity.type === 'artifact' ? 'bg-purple-500' : 'bg-green-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm">{activity.text}</p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}