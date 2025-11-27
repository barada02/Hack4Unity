import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthProvider'
import { useNavigate } from 'react-router-dom'

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'France', 'Germany', 'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Japan', 'Kenya', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'United Kingdom', 'United States', 'Vietnam'
]

const INTERESTS = [
  'Culture', 'Technology', 'Unity', 'Peace', 'Art', 'Music', 'Food', 'Travel', 'Language', 'History', 'Philosophy', 'Science', 'Innovation', 'Community', 'Education', 'Environment', 'Spirituality', 'Sports', 'Literature', 'Photography'
]

export default function ProfileSetup() {
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { updateProfile, profile, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Pre-fill form if profile exists
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '')
      setBio(profile.bio || '')
      setCountry(profile.country || '')
      setSelectedInterests(profile.interests || [])
    }
  }, [profile])

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest)
      } else if (prev.length < 10) {
        return [...prev, interest]
      }
      return prev
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!displayName.trim()) {
      setError('Display name is required')
      return
    }

    setIsLoading(true)

    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        country: country || undefined,
        interests: selectedInterests
      })
      
      navigate('/profile') // Redirect to profile page after successful update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/') // Skip profile setup and go to home
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {profile ? 'Update Your Profile' : 'Complete Your Profile'}
            </h1>
            <p className="text-slate-400">
              Tell us about yourself to connect with others who share your interests
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How should others know you?"
                required
                disabled={isLoading}
                maxLength={50}
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us a bit about yourself and what unity means to you..."
                disabled={isLoading}
                maxLength={500}
              />
              <p className="text-slate-500 text-xs mt-1">{bio.length}/500 characters</p>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(countryName => (
                  <option key={countryName} value={countryName}>{countryName}</option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Interests ({selectedInterests.length}/10)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    disabled={isLoading || (!selectedInterests.includes(interest) && selectedInterests.length >= 10)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedInterests.includes(interest)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    } ${
                      !selectedInterests.includes(interest) && selectedInterests.length >= 10
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-2">Select up to 10 interests that describe you</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (profile ? 'Update Profile' : 'Complete Profile')}
              </button>
              
              {!profile && (
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Skip for Now
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}