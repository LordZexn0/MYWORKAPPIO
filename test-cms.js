// Simple test script to verify CMS functionality
// Run with: node test-cms.js

async function testCMS() {
  console.log('🧪 Testing CMS API...\n')
  
  try {
    // Test GET request
    console.log('📡 Testing GET /api/cms...')
    const response = await fetch('http://localhost:3000/api/cms')
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ GET request successful')
      console.log('📊 Content structure:', Object.keys(data))
      console.log('🏠 Home title:', data.home?.hero?.title || 'Not found')
    } else {
      console.log('❌ GET request failed:', response.status, response.statusText)
    }
    
    // Test POST request
    console.log('\n📡 Testing POST /api/cms...')
    const testContent = {
      home: {
        hero: {
          title: 'Test Update - ' + new Date().toLocaleTimeString(),
          subtitle: 'hello',
          description: 'Test description',
          primaryButton: 'Test Button',
          secondaryButton: 'Test Secondary'
        }
      }
    }
    
    const postResponse = await fetch('http://localhost:3000/api/cms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContent)
    })
    
    if (postResponse.ok) {
      const result = await postResponse.json()
      console.log('✅ POST request successful')
      console.log('💾 Storage method:', result.storage || 'unknown')
      console.log('📝 Message:', result.message || 'No message')
    } else {
      console.log('❌ POST request failed:', postResponse.status, postResponse.statusText)
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    console.log('\n💡 Make sure the development server is running (npm run dev)')
  }
}

testCMS()
