import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthProvider'
import { useNavigate, Link } from 'react-router-dom'
import { artifactApi } from '../services/artifactApi'
import type { Artifact } from '../types/artifact'

export default function Profile() {
  const { user, profile, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [userArtifacts, setUserArtifacts] = useState<Artifact[]>([])
  const [loadingArtifacts, setLoadingArtifacts] = useState(true)

  // Redirect if not authenticated and fetch user artifacts
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    } else if (isAuthenticated) {
      fetchUserArtifacts()
    }
  }, [isAuthenticated, isLoading, navigate])

  const fetchUserArtifacts = async () => {
    try {
      setLoadingArtifacts(true)
      const response = await artifactApi.getUserArtifacts()
      if (response.success && response.data) {
        setUserArtifacts(response.data)
      }
    } catch (error) {
      console.error('Error fetching user artifacts:', error)
    } finally {
      setLoadingArtifacts(false)
    }
  }

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

  const publishedArtifacts = userArtifacts.filter(a => a.status === 'published')
  const draftArtifacts = userArtifacts.filter(a => a.status === 'draft')
  const totalLikes = userArtifacts.reduce((sum, artifact) => sum + (artifact.likesCount || 0), 0)
  const totalComments = userArtifacts.reduce((sum, artifact) => sum + (artifact.comments?.length || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
        <p className="text-slate-400 text-lg">
          Track your creative journey and manage your Unity Hub experience
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-xl p-8 mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">
                {getInitials(profile?.displayName)}
              </span>
            </div>
            
            {/* Profile Info */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                {profile?.displayName || 'Unity Creator'}
              </h2>
              <p className="text-slate-400 mb-2">{user.email}</p>
              <p className="text-slate-400 mb-4">Member since {formatDate(user.createdAt)}</p>
              
              {profile?.bio && (
                <p className="text-slate-300 mb-4 text-sm">{profile.bio}</p>
              )}

              {profile?.country && (
                <p className="text-slate-400 mb-4 text-sm">📍 {profile.country}</p>
              )}

              {profile?.interests && profile.interests.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-2">Interests:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profile.interests.slice(0, 4).map((interest) => (
                      <span 
                        key={interest}
                        className="px-2 py-1 bg-slate-800 text-slate-300 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 4 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded-full text-xs">
                        +{profile.interests.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Link 
                  to="/profile/setup"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors text-center"
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

          {/* Stats Card */}
          <div className="bg-slate-900 rounded-xl p-6">
            <h3 className="font-semibold mb-4 text-center">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Artifacts</span>
                <span className="font-semibold">{userArtifacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Published</span>
                <span className="font-semibold text-green-400">{publishedArtifacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Drafts</span>
                <span className="font-semibold text-yellow-400">{draftArtifacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Likes</span>
                <span className="font-semibold text-red-400">{totalLikes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Comments</span>
                <span className="font-semibold text-blue-400">{totalComments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Your Artifacts */}
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Your Artifacts</h3>
              <Link 
                to="/create"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Create New
              </Link>
            </div>

            {loadingArtifacts ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-slate-400">Loading artifacts...</span>
              </div>
            ) : userArtifacts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {userArtifacts.slice(0, 4).map((artifact) => (
                  <div key={artifact._id} className="bg-slate-800 rounded-lg p-4">
                    <div className="aspect-square bg-slate-700 rounded-lg mb-3 overflow-hidden">
                      {artifact.imageUrl ? (
                        <img 
                          src={artifact.imageUrl} 
                          alt={artifact.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl opacity-50">🎨</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium mb-1 line-clamp-1">{artifact.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        artifact.status === 'published' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {artifact.status}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>❤️ {artifact.likesCount || 0}</span>
                        <span>💬 {artifact.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎨</div>
                <h4 className="font-semibold mb-2">No artifacts yet</h4>
                <p className="text-slate-400 mb-4">Start creating your first Unity artifact!</p>
                <Link 
                  to="/create"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors inline-block"
                >
                  Create Your First Artifact
                </Link>
              </div>
            )}

            {userArtifacts.length > 4 && (
              <div className="text-center mt-4">
                <Link 
                  to="/showcase" 
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  View all your artifacts →
                </Link>
              </div>
            )}
          </div>

          {/* Coming Soon Features */}
          <div className="bg-slate-900 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6">Coming Soon to Your Profile</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 opacity-60">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-3">🌍</span>
                  <h4 className="font-medium">Cultural Journey</h4>
                  <span className="ml-auto text-xs bg-orange-900/30 text-orange-400 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-slate-400">Track your cultural discovery progress across different countries and regions.</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 opacity-60">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-3">🤝</span>
                  <h4 className="font-medium">Global Connections</h4>
                  <span className="ml-auto text-xs bg-orange-900/30 text-orange-400 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-slate-400">Connect with other Unity creators from around the world.</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 opacity-60">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-3">🏆</span>
                  <h4 className="font-medium">Achievement System</h4>
                  <span className="ml-auto text-xs bg-orange-900/30 text-orange-400 px-2 py-1 rounded-full">
                    Planned
                  </span>
                </div>
                <p className="text-sm text-slate-400">Earn badges and achievements for your creative contributions.</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 opacity-60">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-3">📊</span>
                  <h4 className="font-medium">Analytics Dashboard</h4>
                  <span className="ml-auto text-xs bg-orange-900/30 text-orange-400 px-2 py-1 rounded-full">
                    Planned
                  </span>
                </div>
                <p className="text-sm text-slate-400">Detailed insights into your artifact performance and engagement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}