# Unity Hub Frontend

> A modern React application for mathematical artifact creation and cultural discovery

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-green.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-blue.svg)](https://tailwindcss.com/)

## 📱 Application Overview

The Unity Hub frontend is a responsive React application that enables users to create mathematical art through Wolfram Language expressions, share their creations with a global community, and discover cultural insights through interactive visualizations.

### ✨ Current Features (v1.0.0)

- **🔐 Authentication System**
  - User registration and login
  - JWT-based secure authentication
  - Profile management with customization

- **🎨 Artifact Creation**
  - Mathematical expression input with Wolfram Language
  - Real-time artifact generation and preview
  - Support for both static images (PNG) and animations (GIF)

- **🌟 Social Features**
  - Artifact showcase gallery with filtering
  - Like and comment system
  - User profiles with statistics
  - Community interaction

- **📱 User Experience**
  - Responsive design for all screen sizes
  - Modern, intuitive interface
  - Fast loading with optimized assets
  - Accessible design patterns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Access to Unity Hub backend API (running on port 3001)

### Installation

1. **Clone and navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   ```bash
   # Create .env file with backend API URL
   echo "VITE_API_BASE_URL=http://localhost:3001" > .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open application:**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
Frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Layout.tsx         # Main application layout
│   │   └── ArtifactCard.tsx   # Social artifact display component
│   ├── pages/                 # Page-level components
│   │   ├── Home.tsx          # Landing page with features
│   │   ├── Showcase.tsx      # Community artifact gallery
│   │   ├── Profile.tsx       # User profile management
│   │   └── CulturalDiscovery.tsx  # Future cultural features
│   ├── services/             # API integration
│   │   ├── api.ts           # Base API configuration
│   │   ├── authApi.ts       # Authentication endpoints
│   │   └── artifactApi.ts   # Artifact CRUD operations
│   ├── contexts/            # React context providers
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   ├── App.css             # Global styles
│   └── index.css           # Tailwind CSS imports
├── package.json             # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🛠️ Development Guide

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally  
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Key Technologies

- **⚛️ React 19**: Latest React with concurrent features
- **📘 TypeScript**: Full type safety and IntelliSense
- **⚡ Vite**: Lightning-fast development and building
- **🎨 Tailwind CSS**: Utility-first CSS framework
- **🌐 React Router**: Client-side routing
- **🔗 Axios**: HTTP client for API communication

### Code Standards

- **TypeScript**: Strict mode enabled with comprehensive type definitions
- **ESLint**: Code linting with React and TypeScript rules
- **Component Structure**: Functional components with hooks
- **State Management**: React Context + useReducer for global state
- **API Integration**: Centralized service layer with proper error handling

## 🎨 UI/UX Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3b82f6
--primary-purple: #8b5cf6
--gradient: linear-gradient(135deg, #3b82f6, #8b5cf6)

/* Neutral Colors */
--background: #1f2937
--surface: #374151
--text-primary: #f9fafb
--text-secondary: #d1d5db

/* Semantic Colors */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
```

### Typography
- **Headings**: Inter font family, various weights
- **Body**: System font stack for optimal readability
- **Code**: Monospace fonts for expressions

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

## 🔌 API Integration

### Authentication Flow
```typescript
// JWT token management
const token = localStorage.getItem('unity-hub-token');

// API request with authentication
const response = await api.get('/artifacts', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Error Handling
```typescript
// Centralized error handling in API service
try {
  const response = await artifactApi.create(artifactData);
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication errors
    logout();
    navigate('/login');
  }
  throw error;
}
```

### State Management
```typescript
// Authentication context pattern
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 📊 Performance Optimization

### Current Optimizations
- **Code Splitting**: Automatic route-based splitting with React.lazy
- **Asset Optimization**: Vite's built-in optimization for images and CSS
- **Bundle Analysis**: Tree shaking for minimal bundle size
- **Caching**: Proper HTTP caching headers for static assets

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 200KB gzipped
- **Lighthouse Score**: 95+ across all categories

## 🧪 Testing Strategy

### Testing Tools (Future Implementation)
```bash
# Unit testing with Jest and React Testing Library
npm install --save-dev @testing-library/react jest

# E2E testing with Playwright
npm install --save-dev @playwright/test

# Component testing with Storybook
npm install --save-dev @storybook/react
```

### Testing Patterns
- **Component Testing**: Isolated component behavior
- **Integration Testing**: API integration and user flows
- **E2E Testing**: Complete user journey validation
- **Visual Regression**: UI consistency across changes

## 🌍 Internationalization (Future)

### Planned i18n Support
```typescript
// React-i18next integration
import { useTranslation } from 'react-i18next';

function ArtifactCard() {
  const { t } = useTranslation();
  
  return (
    <button>{t('artifact.publish')}</button>
  );
}
```

### Supported Languages (Roadmap)
- English (en) - Primary
- Spanish (es)
- French (fr)
- German (de)
- Mandarin (zh)
- Japanese (ja)

## 🔧 Configuration

### Environment Variables
```bash
# .env file configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development
VITE_APP_VERSION=1.0.0
```

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

## 🚀 Deployment

### Production Build
```bash
# Build optimized production bundle
npm run build

# The dist/ folder contains the production build
# Deploy dist/ contents to your hosting service
```

### Deployment Platforms
- **Vercel**: Recommended for React applications
- **Netlify**: Easy deployment with form handling
- **AWS S3 + CloudFront**: Scalable static hosting
- **Google Cloud Storage**: Integration with existing services

### Build Optimization
- Tree shaking for minimal bundle size
- Asset compression and optimization
- CSS purging with Tailwind
- Progressive Web App (PWA) ready structure

## 📈 Future Development Roadmap

### Phase 2: Enhanced User Experience
- Advanced artifact editor with live preview
- Collaborative artifact creation
- Enhanced profile customization
- Advanced search and filtering

### Phase 3: Cultural Discovery
- Interactive cultural comparison tools
- Geographic visualization of user content
- Cultural insight generation
- Cross-cultural collaboration features

### Phase 4: Advanced Features
- Real-time collaboration (WebRTC)
- Progressive Web App (PWA) capabilities
- Offline functionality
- Advanced analytics dashboard

---

For backend integration and API documentation, see the [Backend README](../backend/README.md).
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
