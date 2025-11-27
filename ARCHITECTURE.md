# Unity Hub Architecture Documentation

## 🏗️ System Architecture Overview

Unity Hub is designed as a scalable, microservices-based platform that facilitates creative expression through mathematical art generation and community interaction. The architecture supports both current functionality and future expansion into cultural discovery and global networking.

## 🎯 Current Architecture (v1.0.0)

### System Components

```mermaid
graph TB
    subgraph "User Interface Layer"
        WEB[Web Application<br/>React + TypeScript]
        MOBILE[Mobile Web<br/>Responsive Design]
    end
    
    subgraph "Application Layer"
        FE[Frontend Client<br/>React 19 + Vite<br/>Port: 5173]
        
        subgraph "Authentication"
            AUTH[JWT Authentication<br/>Local Storage]
            PROFILE[User Profiles<br/>Context Management]
        end
    end
    
    subgraph "API Gateway Layer"
        BE[Express Backend<br/>TypeScript + Node.js<br/>Port: 3001]
        
        subgraph "Route Handlers"
            AUTH_API[Auth Routes<br/>/api/auth/*]
            ARTIFACT_API[Artifact Routes<br/>/api/artifacts/*]
        end
        
        subgraph "Middleware"
            CORS[CORS Handler]
            JWT_MIDDLEWARE[JWT Verification]
            VALIDATION[Request Validation<br/>Joi Schemas]
        end
    end
    
    subgraph "Business Logic Layer"
        subgraph "Controllers"
            AUTH_CTRL[AuthController<br/>User Management]
            ARTIFACT_CTRL[ArtifactController<br/>Artifact CRUD]
        end
        
        subgraph "Services"
            CLOUD_SVC[CloudStorageService<br/>Google Cloud Integration]
            EMAIL_SVC[Email Service<br/>Future Implementation]
        end
    end
    
    subgraph "Data Layer"
        DB[(MongoDB Atlas<br/>Document Database)]
        
        subgraph "Collections"
            USERS[Users Collection<br/>Authentication Data]
            PROFILES[Profiles Collection<br/>User Information]
            ARTIFACTS[Artifacts Collection<br/>Generated Content]
        end
    end
    
    subgraph "External Services"
        GCS[Google Cloud Storage<br/>Image/Media Storage]
        
        WOLFRAM[Wolfram Cloud Run<br/>Mathematical Computing]
        
        subgraph "Future Services"
            CULTURAL_API[Cultural Data API<br/>Future Integration]
            AI_SVC[AI Analysis Service<br/>Future Integration]
        end
    end
    
    subgraph "Not Yet Integrated"
        AGENT[Artifact Agent<br/>FastAPI Service]
        STORAGE_SVC[Cloud Storage Service<br/>FastAPI Service]
    end
    
    %% Current Data Flow
    WEB --> FE
    MOBILE --> FE
    FE --> AUTH
    FE --> BE
    BE --> AUTH_API
    BE --> ARTIFACT_API
    BE --> CORS
    BE --> JWT_MIDDLEWARE
    BE --> VALIDATION
    AUTH_API --> AUTH_CTRL
    ARTIFACT_API --> ARTIFACT_CTRL
    AUTH_CTRL --> DB
    ARTIFACT_CTRL --> DB
    ARTIFACT_CTRL --> CLOUD_SVC
    CLOUD_SVC --> GCS
    CLOUD_SVC --> WOLFRAM
    WOLFRAM --> GCS
    DB --> USERS
    DB --> PROFILES
    DB --> ARTIFACTS
    
    %% Future Integrations (Dashed)
    BE -.->|Future| CULTURAL_API
    BE -.->|Future| AI_SVC
    BE -.->|Future| AGENT
    BE -.->|Future| STORAGE_SVC
    
    style AGENT stroke-dasharray: 5 5
    style STORAGE_SVC stroke-dasharray: 5 5
    style CULTURAL_API stroke-dasharray: 5 5
    style AI_SVC stroke-dasharray: 5 5
```

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant User as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant WS as Wolfram Service
    participant GCS as Cloud Storage
    
    Note over User,GCS: Artifact Creation Flow
    
    User->>FE: Create Artifact
    FE->>BE: POST /api/artifacts
    BE->>DB: Save Draft Artifact
    DB-->>BE: Artifact Created
    BE-->>FE: Artifact ID
    
    FE->>BE: POST /api/artifacts/{id}/generate
    BE->>WS: Execute Wolfram Expression
    WS->>WS: Generate Image
    WS->>GCS: Upload Generated Image
    GCS-->>WS: Image URL
    WS-->>BE: Generation Result
    BE->>DB: Update Artifact with Image URL
    BE-->>FE: Generated Artifact
    
    FE->>BE: POST /api/artifacts/{id}/publish
    BE->>DB: Update Status to Published
    BE-->>FE: Published Artifact
    
    Note over User,GCS: Social Interaction Flow
    
    User->>FE: View Showcase
    FE->>BE: GET /api/artifacts/published
    BE->>DB: Query Published Artifacts
    DB-->>BE: Artifact List
    BE-->>FE: Published Artifacts
    
    User->>FE: Like Artifact
    FE->>BE: POST /api/artifacts/{id}/like
    BE->>DB: Toggle Like Status
    BE-->>FE: Updated Like Count
    
    User->>FE: Add Comment
    FE->>BE: POST /api/artifacts/{id}/comments
    BE->>DB: Add Comment to Artifact
    BE-->>FE: Comment Added
```

## 📊 Current Database Schema

### MongoDB Collections

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}

// Profiles Collection  
{
  _id: ObjectId,
  userId: ObjectId,
  displayName: String,
  bio: String,
  avatarUrl: String,
  country: String,
  interests: [String],
  createdAt: Date,
  updatedAt: Date
}

// Artifacts Collection
{
  _id: ObjectId,
  artifactId: String, // Unique identifier
  userId: ObjectId,
  title: String,
  expression: String, // Wolfram Language code
  imageUrl: String,
  format: String, // 'png' | 'gif'
  status: String, // 'draft' | 'published'
  likes: [ObjectId], // User IDs who liked
  comments: [{
    _id: ObjectId,
    userId: ObjectId,
    userName: String,
    comment: String,
    createdAt: Date
  }],
  tags: [String],
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
}
```

## 🔮 Future Architecture Evolution

### Phase 2: Cultural Discovery Integration

```mermaid
graph TB
    subgraph "Enhanced Application Layer"
        CULT_FE[Cultural Discovery UI<br/>Interactive Maps & Comparisons]
        CURR_FE[Current Artifact UI<br/>Existing Functionality]
    end
    
    subgraph "Expanded API Layer"
        CULT_API[Cultural Discovery API<br/>/api/cultural/*]
        CURR_API[Current APIs<br/>Auth & Artifacts]
    end
    
    subgraph "New Business Logic"
        CULT_CTRL[Cultural Controller<br/>Country Comparisons]
        AI_CTRL[AI Insights Controller<br/>Pattern Recognition]
        REPORT_CTRL[Report Generator<br/>Data Visualization]
    end
    
    subgraph "Enhanced Data Layer"
        CULTURAL_DB[(Cultural Database<br/>Country Data, Connections)]
        CURRENT_DB[(Current Database<br/>Users, Artifacts)]
    end
    
    subgraph "AI & Analytics Services"
        ML_SVC[Machine Learning Service<br/>Cultural Pattern Analysis]
        INSIGHT_SVC[Insight Generation<br/>Personalized Recommendations]
        VIZ_SVC[Visualization Service<br/>Report Generation]
    end
    
    CULT_FE --> CULT_API
    CURR_FE --> CURR_API
    CULT_API --> CULT_CTRL
    CULT_API --> AI_CTRL
    CULT_API --> REPORT_CTRL
    CULT_CTRL --> CULTURAL_DB
    AI_CTRL --> ML_SVC
    REPORT_CTRL --> VIZ_SVC
```

### Phase 3: Global Network & Collaboration

```mermaid
graph TB
    subgraph "Social Features"
        CONNECT[User Connections<br/>Friend System]
        COLLAB[Collaborative Projects<br/>Shared Artifacts]
        MENTOR[Mentorship Program<br/>Cultural Guides]
    end
    
    subgraph "Communication Layer"
        CHAT[Real-time Chat<br/>WebSocket Integration]
        NOTIF[Notification System<br/>Push Notifications]
        VIDEO[Video Calls<br/>WebRTC Integration]
    end
    
    subgraph "Recommendation Engine"
        USER_MATCH[User Matching<br/>Similar Interests]
        CONTENT_REC[Content Recommendations<br/>Personalized Feed]
        CULTURAL_MATCH[Cultural Bridge Building<br/>Cross-Cultural Connections]
    end
    
    CONNECT --> CHAT
    COLLAB --> NOTIF
    MENTOR --> VIDEO
    USER_MATCH --> CONTENT_REC
    CONTENT_REC --> CULTURAL_MATCH
```

### Phase 4: Advanced AI Integration

```mermaid
graph TB
    subgraph "AI-Powered Features"
        AUTO_INSIGHT[Automated Cultural Insights<br/>Pattern Recognition]
        SMART_REC[Smart Recommendations<br/>ML-Based Matching]
        PRED_ANALYTICS[Predictive Analytics<br/>Trend Forecasting]
    end
    
    subgraph "Advanced Visualizations"
        3D_VIZ[3D Cultural Maps<br/>Interactive Exploration]
        AR_VR[AR/VR Experiences<br/>Immersive Cultural Tours]
        DYNAMIC_REPORTS[Dynamic Reports<br/>Real-time Data Updates]
    end
    
    subgraph "Intelligent Automation"
        AUTO_TAG[Auto-tagging<br/>Content Categorization]
        LANG_PROCESS[Natural Language Processing<br/>Multi-language Support]
        SENTIMENT[Sentiment Analysis<br/>Community Health Monitoring]
    end
    
    AUTO_INSIGHT --> 3D_VIZ
    SMART_REC --> AR_VR
    PRED_ANALYTICS --> DYNAMIC_REPORTS
    AUTO_TAG --> LANG_PROCESS
    LANG_PROCESS --> SENTIMENT
```

## 🔧 Technology Evolution Plan

### Current Tech Stack (v1.0.0)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: MongoDB Atlas
- **Cloud**: Google Cloud Storage, Cloud Run
- **Authentication**: JWT, bcrypt

### Planned Additions

#### Phase 2 Technologies
- **AI/ML**: TensorFlow.js, Python ML services
- **Data Processing**: Apache Spark, Pandas
- **Visualization**: D3.js, Chart.js, Three.js
- **Cultural Data**: REST Countries API, World Bank API

#### Phase 3 Technologies  
- **Real-time**: Socket.io, WebRTC
- **Search**: Elasticsearch, Algolia
- **Caching**: Redis, CDN integration
- **Mobile**: React Native (future mobile apps)

#### Phase 4 Technologies
- **Advanced AI**: OpenAI GPT integration, Custom ML models
- **3D/AR/VR**: WebGL, A-Frame, React 360
- **Analytics**: Apache Kafka, Tableau integration
- **Microservices**: Docker, Kubernetes, Service Mesh

## 🔐 Security Architecture

### Current Security Measures
- JWT token authentication
- bcrypt password hashing
- CORS protection
- Input validation (Joi schemas)
- HTTPS enforcement
- Environment variable protection

### Future Security Enhancements
- OAuth 2.0 / Social login integration
- Role-based access control (RBAC)
- API rate limiting
- Content moderation AI
- Privacy-compliant data handling
- End-to-end encryption for messages

## 📈 Scalability Considerations

### Current Scalability Features
- Cloud-native architecture
- Stateless API design
- Document database (MongoDB)
- CDN-ready static assets
- Microservice-ready structure

### Future Scalability Plans
- Horizontal API scaling
- Database sharding strategies
- Caching layer implementation
- Load balancer integration
- Container orchestration (Kubernetes)
- Multi-region deployment

---

This architecture document provides a roadmap for Unity Hub's evolution from a creative artifact platform to a comprehensive cultural discovery and global networking ecosystem.