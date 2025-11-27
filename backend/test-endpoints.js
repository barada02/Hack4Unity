#!/usr/bin/env node

/**
 * Test script for Unity Hub Authentication API
 * This script tests all auth endpoints with a dummy user
 */

const API_BASE_URL = 'http://localhost:3001/api'

// Test user data
const testUser = {
  email: 'test@unityhub.com',
  password: 'testpassword123'
}

const testProfile = {
  displayName: 'Unity Test User',
  bio: 'A test user exploring cultural connections',
  country: 'India', 
  interests: ['culture', 'unity', 'technology', 'peace'],
  avatarUrl: 'https://via.placeholder.com/150'
}

let authToken = null

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  }

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  console.log(`\n🔄 ${requestOptions.method || 'GET'} ${url}`)
  
  try {
    const response = await fetch(url, requestOptions)
    const data = await response.json()
    
    if (response.ok) {
      console.log(`✅ Success (${response.status}):`, data)
      return { success: true, data, status: response.status }
    } else {
      console.log(`❌ Error (${response.status}):`, data)
      return { success: false, data, status: response.status }
    }
  } catch (error) {
    console.log(`💥 Network Error:`, error.message)
    return { success: false, error: error.message }
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n📋 Testing Health Check...')
  return await makeRequest('/health')
}

async function testRegister() {
  console.log('\n👤 Testing User Registration...')
  const result = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  })
  
  if (result.success && result.data.data?.token) {
    authToken = result.data.data.token
    console.log('🔑 Auth token saved for subsequent requests')
  }
  
  return result
}

async function testLogin() {
  console.log('\n🔐 Testing User Login...')
  const result = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(testUser)
  })
  
  if (result.success && result.data.data?.token) {
    authToken = result.data.data.token
    console.log('🔑 Auth token updated from login')
  }
  
  return result
}

async function testGetCurrentUser() {
  console.log('\n👨‍💻 Testing Get Current User...')
  return await makeRequest('/auth/me')
}

async function testCreateProfile() {
  console.log('\n📝 Testing Create Profile...')
  return await makeRequest('/auth/profile', {
    method: 'POST',
    body: JSON.stringify(testProfile)
  })
}

async function testGetProfile() {
  console.log('\n👤 Testing Get Profile...')
  return await makeRequest('/auth/profile')
}

async function testUpdateProfile() {
  console.log('\n🔄 Testing Update Profile...')
  const updatedProfile = {
    ...testProfile,
    bio: 'Updated bio: Passionate about building unity through technology!',
    interests: [...testProfile.interests, 'hackathon', 'innovation']
  }
  
  return await makeRequest('/auth/profile', {
    method: 'POST',
    body: JSON.stringify(updatedProfile)
  })
}

async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing Unauthorized Access (without token)...')
  const tempToken = authToken
  authToken = null // Remove token temporarily
  
  const result = await makeRequest('/auth/me')
  
  authToken = tempToken // Restore token
  return result
}

async function testInvalidToken() {
  console.log('\n🔓 Testing Invalid Token...')
  const tempToken = authToken
  authToken = 'invalid-token-123'
  
  const result = await makeRequest('/auth/me')
  
  authToken = tempToken // Restore valid token
  return result
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Unity Hub Authentication API Tests')
  console.log('=' .repeat(60))
  
  const results = []
  
  try {
    // Test 1: Health Check
    results.push(await testHealthCheck())
    
    // Test 2: Register (or try to register)
    const registerResult = await testRegister()
    results.push(registerResult)
    
    // If registration fails (user exists), try login
    if (!registerResult.success && registerResult.status === 409) {
      console.log('ℹ️ User already exists, trying login instead...')
      results.push(await testLogin())
    }
    
    // Test 3: Get current user info
    results.push(await testGetCurrentUser())
    
    // Test 4: Create profile
    results.push(await testCreateProfile())
    
    // Test 5: Get profile
    results.push(await testGetProfile())
    
    // Test 6: Update profile
    results.push(await testUpdateProfile())
    
    // Test 7: Get updated profile
    results.push(await testGetProfile())
    
    // Test 8: Test unauthorized access
    results.push(await testUnauthorizedAccess())
    
    // Test 9: Test invalid token
    results.push(await testInvalidToken())
    
  } catch (error) {
    console.error('💥 Test suite failed:', error)
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60))
  console.log('📊 TEST SUMMARY')
  console.log('=' .repeat(60))
  
  const successCount = results.filter(r => r.success).length
  const totalTests = results.length
  
  console.log(`✅ Passed: ${successCount}/${totalTests}`)
  console.log(`❌ Failed: ${totalTests - successCount}/${totalTests}`)
  
  if (successCount === totalTests) {
    console.log('\n🎉 All tests passed! Authentication system is working correctly.')
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.')
  }
  
  console.log('\n💡 Next Steps:')
  console.log('- Start the backend server: npm run dev')
  console.log('- Ensure MongoDB is running and accessible')
  console.log('- Check .env file configuration')
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch support')
  console.log('Install node-fetch if using older Node.js:')
  console.log('npm install node-fetch')
  process.exit(1)
}

// Run tests
runTests().catch(error => {
  console.error('💥 Unhandled error:', error)
  process.exit(1)
})