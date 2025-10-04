// Simple API test script
// Run with: node test-api.js

const API_BASE_URL = 'https://localhost:7004/api';

async function testAPI() {
  console.log('Testing API connection...');
  
  try {
    // Test basic connectivity
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Health check passed');
    } else {
      console.log('⚠️ Health check failed (endpoint might not exist)');
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  try {
    // Test login endpoint structure
    console.log('2. Testing login endpoint structure...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    console.log('Login endpoint response status:', loginResponse.status);
    
    if (loginResponse.status === 401 || loginResponse.status === 400) {
      console.log('✅ Login endpoint is responding (authentication failed as expected)');
    } else if (loginResponse.status === 200) {
      console.log('✅ Login endpoint is responding (authentication successful)');
    } else {
      console.log('⚠️ Unexpected response status:', loginResponse.status);
    }
    
    const responseText = await loginResponse.text();
    console.log('Response:', responseText);
    
  } catch (error) {
    console.log('❌ Login endpoint test failed:', error.message);
  }

  try {
    // Test users endpoint
    console.log('3. Testing users endpoint...');
    const usersResponse = await fetch(`${API_BASE_URL}/users`);
    console.log('Users endpoint response status:', usersResponse.status);
    
    if (usersResponse.status === 401) {
      console.log('✅ Users endpoint is responding (authentication required as expected)');
    } else if (usersResponse.status === 200) {
      console.log('✅ Users endpoint is responding');
      const users = await usersResponse.json();
      console.log('Users:', users);
    } else {
      console.log('⚠️ Unexpected response status:', usersResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Users endpoint test failed:', error.message);
  }

  console.log('\nAPI test completed!');
  console.log('\nIf you see connection errors:');
  console.log('1. Make sure your backend server is running on http://localhost:7004');
  console.log('2. Check if the API endpoints match the expected structure');
  console.log('3. Verify CORS settings allow requests from your frontend');
}

// Run the test
testAPI().catch(console.error);
