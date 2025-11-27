#!/usr/bin/env node

/**
 * Test script for Unity Hub Artifact API
 */

const API_BASE_URL = 'http://localhost:3001/api'

// Test artifact data
const testArtifact = {
  title: 'Beautiful Sine Wave',
  expression: 'Plot[Sin[x], {x, 0, 2*Pi}]',
  format: 'png',
  tags: ['mathematics', 'wave', 'sine']
}

let authToken = null
let testArtifactId = null

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

// Login to get auth token
async function login() {
  console.log('\n🔐 Logging in...')
  const result = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@unityhub.com',
      password: 'testpassword123'
    })
  })
  
  if (result.success && result.data.data?.token) {
    authToken = result.data.data.token
    console.log('🔑 Auth token obtained')
    return true
  }
  return false
}

// Test artifact creation
async function testCreateArtifact() {
  console.log('\n🎨 Testing Create Artifact...')
  const result = await makeRequest('/artifacts', {
    method: 'POST',
    body: JSON.stringify(testArtifact)
  })
  
  if (result.success && result.data.data?.artifactId) {
    testArtifactId = result.data.data.artifactId
    console.log('📝 Artifact created with ID:', testArtifactId)
  }
  
  return result
}

// Test artifact generation
async function testGenerateArtifact() {
  if (!testArtifactId) {
    console.log('❌ No artifact ID available for generation test')
    return { success: false }
  }
  
  console.log('\n🎭 Testing Generate Artifact...')
  const result = await makeRequest(`/artifacts/${testArtifactId}/generate`, {
    method: 'POST'
  })
  
  return result
}

// Test artifact publishing
async function testPublishArtifact() {
  if (!testArtifactId) {
    console.log('❌ No artifact ID available for publishing test')
    return { success: false }
  }
  
  console.log('\n📤 Testing Publish Artifact...')
  const result = await makeRequest(`/artifacts/${testArtifactId}/publish`, {
    method: 'POST'
  })
  
  return result
}

// Test get user artifacts
async function testGetUserArtifacts() {
  console.log('\n👤 Testing Get User Artifacts...')
  return await makeRequest('/artifacts/my-artifacts')
}

// Test get published artifacts
async function testGetPublishedArtifacts() {
  console.log('\n🌟 Testing Get Published Artifacts...')
  return await makeRequest('/artifacts/published')
}

// Test like artifact
async function testLikeArtifact() {
  if (!testArtifactId) {
    console.log('❌ No artifact ID available for like test')
    return { success: false }
  }
  
  console.log('\n💖 Testing Like Artifact...')
  return await makeRequest(`/artifacts/${testArtifactId}/like`, {
    method: 'POST'
  })
}

// Test add comment
async function testAddComment() {
  if (!testArtifactId) {
    console.log('❌ No artifact ID available for comment test')
    return { success: false }
  }
  
  console.log('\n💬 Testing Add Comment...')
  return await makeRequest(`/artifacts/${testArtifactId}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      comment: 'This is a beautiful mathematical visualization! Great work.'
    })
  })
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Unity Hub Artifact API Tests')
  console.log('=' .repeat(60))
  
  const results = []
  
  try {
    // Step 1: Login
    const loginSuccess = await login()
    if (!loginSuccess) {
      console.log('❌ Login failed, cannot proceed with artifact tests')
      return
    }
    
    // Step 2: Create artifact
    results.push(await testCreateArtifact())
    
    // Step 3: Generate artifact (will fail without Cloud Run service)
    results.push(await testGenerateArtifact())
    
    // Step 4: Get user artifacts
    results.push(await testGetUserArtifacts())
    
    // Step 5: Get published artifacts
    results.push(await testGetPublishedArtifacts())
    
    // Note: Publish, Like, and Comment tests will only work if generation succeeds
    console.log('\n⚠️ Skipping publish/like/comment tests (require successful generation)')
    
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
  
  console.log('\n💡 Notes:')
  console.log('- Generation will fail without proper CLOUD_RUN_SERVICE_URL')
  console.log('- Publishing requires successful generation')
  console.log('- Likes/comments require published artifacts')
  console.log('\n🔧 Setup:')
  console.log('- Add CLOUD_RUN_SERVICE_URL to your .env file')
  console.log('- Ensure your Cloud Run service is deployed and accessible')
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch support')
  process.exit(1)
}

// Run tests
runTests().catch(error => {
  console.error('💥 Unhandled error:', error)
  process.exit(1)
})