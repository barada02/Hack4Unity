# Authentication API Endpoints

## Base URL
`http://localhost:3001`

## Endpoints

### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "password123"
}
```

### 3. Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

### 4. Get User Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

### 5. Create/Update Profile (Protected)
```http
POST /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "bio": "Unity enthusiast from India",
  "country": "India",
  "interests": ["culture", "technology", "unity"],
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

## Response Format
All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {...}, // Only on success
  "errors": [...] // Only on validation errors
}
```