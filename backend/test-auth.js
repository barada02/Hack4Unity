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

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    const data = await response.json()
    
    console.log(`\n📡 ${options.method || 'GET'} ${endpoint}`)
    console.log(`Status: ${response.status} ${response.statusText}`)
    console.log('Response:', JSON.stringify(data, null, 2))
    
    return { response, data }
  } catch (error) {
    console.error(`❌ Error calling ${endpoint}:`, error.message)
    return { error }
  }
}

async function testAuthenticationFlow() {
  console.log('🚀 Starting Unity Hub Authentication Test')
  console.log('='=50)

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
    if (registerResult.data && registerResult.data.message.includes('already exists')) {
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
        return
      }
    } else {
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

  // 9. Test missing token
  console.log('\n9️⃣ Testing Missing Token')
  await apiRequest('/auth/me', {
    method: 'GET'
  })

  console.log('\n🎉 Authentication Test Complete!')
  console.log('='=50)
  console.log(`👤 Test User ID: ${userId}`)
  console.log(`📧 Test Email: ${testUser.email}`)
  console.log('🔗 Next steps: Start frontend development')
}

// Run the test
if (typeof window === 'undefined') {
  // Running in Node.js
  const fetch = require('node-fetch')
  global.fetch = fetch
  testAuthenticationFlow().catch(console.error)
} else {
  // Running in browser
  testAuthenticationFlow().catch(console.error)
}