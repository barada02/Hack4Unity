export const VERSION_INFO = {
  version: '1.0.0',
  releaseDate: '2025-11-28',
  name: 'Unity Artifacts',
  features: {
    live: [
      'User Authentication & Profiles',
      'Wolfram Language Artifact Generation', 
      'Image & Animation Creation (PNG/GIF)',
      'Community Showcase Gallery',
      'Like & Comment System',
      'Real-time Artifact Publishing',
      'Google Cloud Storage Integration',
      'Responsive Design & Mobile Support'
    ],
    upcoming: [
      'Cultural Discovery Engine',
      'Global User Network',
      'Achievement System',
      'Analytics Dashboard',
      'AI-Powered Cultural Insights',
      'Advanced Collaboration Tools'
    ]
  }
}

export const getVersionString = () => `v${VERSION_INFO.version}`
export const isFeatureLive = (feature: string) => 
  VERSION_INFO.features.live.includes(feature)
export const isFeatureUpcoming = (feature: string) => 
  VERSION_INFO.features.upcoming.includes(feature)