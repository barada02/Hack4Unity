import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import Layout from './components/Layout'
import Home from './pages/Home'
import CulturalDiscovery from './pages/CulturalDiscovery'
import Showcase from './pages/Showcase'
import Profile from './pages/Profile'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ProfileSetup from './components/ProfileSetup'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes (without layout) */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        
        {/* Main App Routes (with layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cultural" element={<CulturalDiscovery />} />
          <Route path="showcase" element={<Showcase />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/setup" element={<ProfileSetup />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
