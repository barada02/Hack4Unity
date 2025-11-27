#!/usr/bin/env node

// Simple authentication test script for Unity Hub backend
// Run with: node test-auth-simple.js

const http = require('http')
const https = require('https')

const API_BASE_URL = 'http://localhost:3001/api'

// Test data
const testUser = {
  email: 'test@unity.com',
  password: 'testpass123'
}

const testProfile = {
  displayName: 'Test Unity User',
  bio: 'Testing the Unity Hub authentication system',
  country: 'India',
  interests: ['culture', 'technology', 'unity', 'hackathon'],
  avatarUrl: 'https://via.placeholder.com/150'
}

// Simple HTTP request function
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === 'https:'
    const client = isHttps ? https : http

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    const req = client.request(requestOptions, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {}
          resolve({ 
            status: res.statusCode, 
            statusText: res.statusMessage,
            data: jsonData 
          })
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            statusText: res.statusMessage,
            data: { error: 'Invalid JSON response', raw: data } 
          })
        }
      })
    })

    req.on('error', reject)

    if (options.body) {
      req.write(options.body)
    }

    req.end()
  })
}

async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const result = await makeRequest(url, options)
    
    console.log(`\n📡 ${options.method || 'GET'} ${endpoint}`)
    console.log(`Status: ${result.status} ${result.statusText}`)
    console.log('Response:', JSON.stringify(result.data, null, 2))
    
    return result
  } catch (error) {
    console.error(`❌ Error calling ${endpoint}:`, error.message)
    return { error }
  }
}

async function testAuthenticationFlow() {
  console.log('🚀 Unity Hub Authentication Test')
  console.log('='.repeat(50))

  let authToken = null
  let userId = null

  // 1. Test health endpoint
  console.log('\n1️⃣ Testing Health Endpoint')
  await apiRequest('/health')

  // 2. Test API info endpoint
  console.log('\n2️⃣ Testing API Info')
  await apiRequest('')

  // 3. Test user registration
  console.log('\n3️⃣ Testing User Registration')
  const registerResult = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  })

  if (registerResult.data && registerResult.data.success) {
    authToken = registerResult.data.data.token
    userId = registerResult.data.data.user._id
    console.log('✅ Registration successful!')
    console.log(`🔑 Token: ${authToken.substring(0, 20)}...`)
  } else {
    console.log('❌ Registration failed')
    if (registerResult.data && registerResult.data.message && registerResult.data.message.includes('already exists')) {
      console.log('📝 User already exists, trying login instead...')
      
      // Try login if user already exists
      const loginResult = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(testUser)
      })

      if (loginResult.data && loginResult.data.success) {
        authToken = loginResult.data.data.token
        userId = loginResult.data.data.user._id
        console.log('✅ Login successful!')
        console.log(`🔑 Token: ${authToken.substring(0, 20)}...`)
      } else {
        console.log('❌ Login also failed, stopping tests')
        console.log('💡 Make sure the backend server is running on port 3001')
        return
      }
    } else {
      console.log('💡 Make sure the backend server is running on port 3001')
      return
    }
  }

  // 4. Test getting current user
  console.log('\n4️⃣ Testing Get Current User')
  await apiRequest('/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })

  // 5. Test creating/updating profile
  console.log('\n5️⃣ Testing Profile Creation')
  await apiRequest('/auth/profile', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(testProfile)
  })

  // 6. Test getting profile
  console.log('\n6️⃣ Testing Get Profile')
  await apiRequest('/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })

  // 7. Test updating profile
  console.log('\n7️⃣ Testing Profile Update')
  const updatedProfile = {
    ...testProfile,
    bio: 'Updated bio - Authentication system working perfectly!',
    interests: [...testProfile.interests, 'testing']
  }
  
  await apiRequest('/auth/profile', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(updatedProfile)
  })

  // 8. Test invalid token
  console.log('\n8️⃣ Testing Invalid Token')
  await apiRequest('/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid-token-here'
    }
  })

  console.log('\n🎉 Authentication Test Complete!')
  console.log('='.repeat(50))
  console.log(`👤 Test User ID: ${userId}`)
  console.log(`📧 Test Email: ${testUser.email}`)
  console.log('🔗 Next steps: Start frontend development')
  console.log('\n📝 To run backend: cd backend && npm run dev')
  console.log('📝 To test again: node test-auth-simple.js')
}

// Run the test
console.log('🔍 Checking if backend is running...')
testAuthenticationFlow().catch((error) => {
  console.error('\n💥 Test failed:', error.message)
  console.log('\n💡 Make sure to:')
  console.log('   1. Start MongoDB service')
  console.log('   2. Create backend/.env with MONGODB_URL')
  console.log('   3. Run: cd backend && npm install && npm run dev')
})