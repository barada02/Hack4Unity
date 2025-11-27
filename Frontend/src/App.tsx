import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CulturalDiscovery from './pages/CulturalDiscovery'
import Showcase from './pages/Showcase'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cultural" element={<CulturalDiscovery />} />
        <Route path="showcase" element={<Showcase />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
