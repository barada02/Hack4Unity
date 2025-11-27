import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthProvider'
import { useNavigate, Link } from 'react-router-dom'

export default function Profile() {
  const { user, profile, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2 mb-8"></div>
          <div className="bg-slate-900 rounded-xl p-8">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-slate-800 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect via useEffect
  }

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
            <span className="text-2xl font-bold">
              {getInitials(profile?.displayName)}
            </span>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">
              {profile?.displayName ? `Welcome, ${profile.displayName}!` : 'Welcome!'}
            </h2>
            <p className="text-slate-400 mb-2">{user.email}</p>
            <p className="text-slate-400 mb-4">Member since {formatDate(user.createdAt)}</p>
            
            {profile?.bio && (
              <p className="text-slate-300 mb-4 max-w-2xl">{profile.bio}</p>
            )}

            {profile?.country && (
              <p className="text-slate-400 mb-4">📍 {profile.country}</p>
            )}

            {profile?.interests && profile.interests.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-2">Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span 
                      key={interest}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/profile/setup"
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {profile ? 'Edit Profile' : 'Complete Profile'}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
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