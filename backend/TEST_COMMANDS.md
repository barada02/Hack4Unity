# Unity Hub Auth API Test Commands

## Prerequisites
1. Start the backend server: `npm run dev`
2. Ensure MongoDB is running

## Test Commands

### 1. Health Check
```bash
curl -X GET http://localhost:3001/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@unityhub.com",
    "password": "testpassword123"
  }'
```

### 3. Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@unityhub.com", 
    "password": "testpassword123"
  }'
```

### 4. Get Current User (Replace TOKEN with actual JWT)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 5. Create Profile (Replace TOKEN with actual JWT)
```bash
curl -X POST http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Unity Test User",
    "bio": "A test user exploring cultural connections",
    "country": "India",
    "interests": ["culture", "unity", "technology"],
    "avatarUrl": "https://via.placeholder.com/150"
  }'
```

### 6. Get Profile (Replace TOKEN with actual JWT)
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Quick Test Commands

### PowerShell (Windows)
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET

# Register
$body = @{
  email = "test@unityhub.com"
  password = "testpassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```