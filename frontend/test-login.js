// Test login with your actual credentials
// Run with: node test-login.js

const API_BASE_URL = 'https://localhost:7004/api';

async function testLogin() {
  console.log('Testing login with your credentials...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: 'bharadiya.99@gmail.com',
        password: 'Admin@123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('Token:', data.token);
      console.log('User:', {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role
      });
    } else {
      const errorText = await response.text();
      console.log('❌ Login failed:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
    
    if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'SELF_SIGNED_CERT') {
      console.log('🔒 This is likely a self-signed certificate issue.');
      console.log('Try running with: NODE_TLS_REJECT_UNAUTHORIZED=0 node test-login.js');
    }
  }
}

// Run the test
testLogin().catch(console.error);
