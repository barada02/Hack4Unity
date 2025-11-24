# Unity Hub - Backend Architecture Design

## 🏗️ **Distributed Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  ADK Service    │
│   (React)       │◄──►│   (Express)     │◄──►│ (Cloud Run)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                         ┌──────▼──────┐        ┌───────▼─────────┐
                         │  MongoDB    │        │  Wolfram Cloud  │
                         │  Database   │        │     API         │
                         └─────────────┘        └─────────────────┘
                                │                        │
                                │               ┌────────▼─────────┐
                         ┌──────▼──────┐       │ Pre-built Wolfram│
                         │   Redis     │       │   Functions      │
                         │   Cache     │       └──────────────────┘
                         └─────────────┘
```

---

## 🎯 **Service Breakdown**

### **1. Frontend (React - Port 5173)**
- **Role**: UI/UX, user interactions, routing
- **Responsibilities**: 
  - User interface and navigation
  - Form handling and validation
  - Real-time updates (WebSocket client)
  - Authentication state management

### **2. Backend API (Express - Port 3001)**
- **Role**: Core application logic, data management
- **Responsibilities**:
  - User authentication & authorization
  - Database operations (CRUD)
  - File upload/storage management
  - WebSocket server for real-time features
  - Rate limiting and security
  - Caching strategy

### **3. ADK Service (Cloud Run - Auto-scaling)**
- **Role**: AI agent for dynamic Wolfram code generation
- **Responsibilities**:
  - Natural language → Wolfram code conversion
  - Complex AI reasoning and planning
  - Advanced prompt engineering
  - Integration with Google AI services

### **4. Wolfram Integration Layer**
- **Role**: Computational engine for both services
- **Responsibilities**:
  - Execute Wolfram Language code
  - Cultural data analysis
  - Artifact generation
  - Mathematical computations

---

## 🔄 **Data Flow Patterns**

### **Pattern 1: Cultural Discovery (Hardcoded Functions)**
```
Frontend → Backend API → Wolfram Cloud API → Response
   │                           │
   │                     ┌─────▼─────┐
   └─────────────────────│ MongoDB   │
                         │ (Save)    │
                         └───────────┘
```

### **Pattern 2: Artifact Creation (AI-Generated)**
```
Frontend → Backend API → ADK Service → Wolfram Cloud API
   │           │              │              │
   │           │              │         ┌────▼────┐
   │           │              │         │ Execute │
   │           │              │         │  Code   │
   │           │              │         └────┬────┘
   │           │              │              │
   │           │         ┌────▼──────────────▼────┐
   │           │         │     Artifact Result    │
   │           │         └────┬──────────────┬────┘
   │           │              │              │
   │      ┌────▼────┐    ┌────▼────┐    ┌───▼────┐
   └──────│ MongoDB │    │  File   │    │ Return │
          │ (Meta)  │    │ Storage │    │   UI   │
          └─────────┘    └─────────┘    └────────┘
```

---

## 🛠️ **Technology Stack**

### **Frontend Stack**
```typescript
// Already implemented
- React 18 + TypeScript
- Vite (build tool)
- React Router (navigation)
- Tailwind CSS (styling)
- WebSocket client (real-time)
```

### **Backend API Stack**
```javascript
// To implement
- Express.js + TypeScript
- MongoDB + Mongoose (data)
- Redis (caching)
- Socket.io (WebSocket)
- JWT (authentication)
- Multer (file uploads)
- Helmet (security)
```

### **ADK Service Stack**
```python
# Google ADK on Cloud Run
- Python 3.11
- Google Agent Development Kit
- FastAPI (web framework)
- Wolfram Client Library
- Google Cloud Functions integration
```

### **Shared Infrastructure**
```yaml
# Cloud Resources
- MongoDB Atlas (database)
- Redis Cloud (caching)
- Google Cloud Storage (files)
- Wolfram Cloud API (computation)
- Google Cloud Run (ADK hosting)
```

---

## 🔐 **Security Architecture**

### **Authentication Flow**
```
Frontend → Backend API → JWT Verification
    │           │
    │      ┌────▼────┐
    │      │ MongoDB │
    │      │ Users   │
    │      └─────────┘
    │
ADK Service ← Backend API (Service-to-Service Auth)
```

### **API Security Layers**
```javascript
// Backend API middleware stack
app.use(helmet())                    // Security headers
app.use(rateLimiter)                // Rate limiting
app.use(cors({ origin: frontend })) // CORS policy
app.use(jwtMiddleware)              // Authentication
app.use(validation)                 // Input validation
```

---

## 📊 **Database Design**

### **MongoDB Collections Structure**
```javascript
// User management
users: {
  _id, username, email, password_hash,
  profile: { avatar, bio, interests },
  stats: { artifacts_created, discoveries_made }
}

// Cultural discoveries (private to user)
cultural_discoveries: {
  _id, user_id, country1, country2,
  wolfram_results: { similarities, insights },
  created_at, saved
}

// Artifacts (social/public)
artifacts: {
  _id, creator_id, title, description,
  wolfram_code, result_url, file_path,
  tags: [], visibility: 'public/private',
  stats: { likes, views, remixes }
}

// Social interactions
interactions: {
  _id, user_id, target_type, target_id,
  action: 'like/comment/remix/follow',
  content, created_at
}
```

### **Redis Caching Strategy**
```javascript
// Cache layers
"wolfram:cultural:{country1}:{country2}" → Cultural data (TTL: 1 day)
"user:profile:{user_id}" → User profile (TTL: 1 hour)  
"artifacts:trending" → Trending artifacts (TTL: 15 min)
"wolfram:code:{hash}" → Generated code results (TTL: 6 hours)
```

---

## 🔄 **API Communication Patterns**

### **Backend → ADK Service**
```javascript
// Service-to-service communication
async function generateWolframCode(prompt, context) {
  const response = await fetch(`${ADK_SERVICE_URL}/generate-code`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      prompt, 
      context,
      user_preferences: user.preferences 
    })
  })
  return response.json()
}
```

### **Backend → Wolfram Cloud**
```javascript
// Multiple Wolfram integration points
class WolframService {
  // Hardcoded cultural functions
  static async culturalComparison(country1, country2) {
    return this.executeCode(`
      culturalData1 = CountryData["${country1}", All];
      culturalData2 = CountryData["${country2}", All];
      findSimilarities[culturalData1, culturalData2]
    `)
  }
  
  // AI-generated dynamic code
  static async executeGeneratedCode(code, context) {
    return this.executeCode(code, { 
      timeout: 30000,
      context: context 
    })
  }
}
```

---

## 🚀 **Deployment Strategy**

### **Development Environment**
```yaml
Frontend: localhost:5173 (Vite dev server)
Backend: localhost:3001 (Express dev server)  
ADK Service: localhost:8000 (Local Python server)
Database: MongoDB Atlas (shared)
Cache: Redis Cloud (shared)
```

### **Production Environment**
```yaml
Frontend: Vercel/Netlify (Static hosting)
Backend: Railway/Render (Container hosting)
ADK Service: Google Cloud Run (Serverless)
Database: MongoDB Atlas (Production cluster)
Cache: Redis Cloud (Production tier)
File Storage: Google Cloud Storage
```

---

## 📈 **Scalability Considerations**

### **Traffic Patterns**
```
Cultural Discovery: Medium load, cacheable results
Artifact Creation: High compute, queue-based processing  
Social Features: High read, low write, real-time updates
```

### **Scaling Strategy**
```javascript
// Backend API scaling
- Horizontal scaling with load balancer
- Database connection pooling
- Redis cluster for cache
- CDN for static assets

// ADK Service scaling  
- Google Cloud Run auto-scaling
- Queue system for heavy computations
- Circuit breaker for Wolfram API
```

---

## 🔧 **Development Workflow**

### **Phase 1: Core Backend Setup**
1. Express API with MongoDB connection
2. User authentication system
3. Basic CRUD operations
4. Wolfram Cloud integration

### **Phase 2: ADK Integration** 
1. Deploy basic ADK service to Cloud Run
2. Service-to-service communication
3. AI code generation pipeline
4. Error handling and fallbacks

### **Phase 3: Advanced Features**
1. Real-time WebSocket features
2. File upload and storage
3. Caching optimization
4. Performance monitoring

**This architecture gives you flexibility, scalability, and clear separation of concerns. Ready to start implementing any component!** 🚀