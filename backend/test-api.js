// Simple test script to verify the API endpoints work correctly
import http from 'http';

const API_HOST = 'localhost';
const API_PORT = 5000;

// Test data matching the Flutter app structure
const testBenchmarkData = {
  "circuit": "Poseidon",
  "framework": "MoPro",
  "language": "circom",
  "provingTimeMiliSeconds": 2463,
  "verificationTimeMiliSeconds": 222,
  "deviceInfo": {
    "platform": "Android",
    "device": "sdk_gphone64_x86_64",
    "manufacturer": "Google",
    "androidVersion": "14",
    "androidId": "TEST_ANDROID_ID_123",
    "memory": {
      "totalPhysicalMemory": 2069602304,
      "memoryUsedBeforeProof": 1860489216,
      "peakMemoryUsage": 1923002368,
      "memoryConsumedByProof": 62513152,
      "peakMemoryLoadInPercentage": 92.91651658308166,
      "memoryConsumedInPercentage": 3.0205393509264282
    },
    "battery": {
      "batteryBeforeProof": 100,
      "batteryAfterProof": 100,
      "batteryConsumed": 0
    }
  },
  "proofSize": 1073,
  "timestamp": "2025-11-11T11:23:27.366651"
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Deimos Backend API\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing health endpoint...');
    const healthResponse = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${healthResponse.statusCode}`);
    console.log(`   Response:`, healthResponse.data);
    console.log(healthResponse.statusCode === 200 ? '   ✅ PASSED\n' : '   ❌ FAILED\n');

    // Test 2: Get Filters
    console.log('2️⃣  Testing filters endpoint...');
    const filtersResponse = await makeRequest('GET', '/api/filters');
    console.log(`   Status: ${filtersResponse.statusCode}`);
    console.log(`   Response:`, filtersResponse.data);
    console.log(filtersResponse.statusCode === 200 ? '   ✅ PASSED\n' : '   ❌ FAILED\n');

    // Test 3: Submit Benchmark Data
    console.log('3️⃣  Testing benchmark submission...');
    const submitResponse = await makeRequest('POST', '/api/benchmark-result', testBenchmarkData);
    console.log(`   Status: ${submitResponse.statusCode}`);
    console.log(`   Response:`, submitResponse.data);
    console.log(submitResponse.statusCode === 201 ? '   ✅ PASSED\n' : '   ❌ FAILED\n');

    // Test 4: Duplicate Check
    console.log('4️⃣  Testing duplicate detection...');
    const duplicateResponse = await makeRequest('POST', '/api/benchmark-result', testBenchmarkData);
    console.log(`   Status: ${duplicateResponse.statusCode}`);
    console.log(`   Response:`, duplicateResponse.data);
    console.log(duplicateResponse.data.duplicate ? '   ✅ PASSED (Duplicate detected)\n' : '   ❌ FAILED\n');

    // Test 5: Get Benchmarks
    console.log('5️⃣  Testing benchmarks endpoint...');
    const benchmarksResponse = await makeRequest('GET', '/api/benchmarks?page=1&limit=10');
    console.log(`   Status: ${benchmarksResponse.statusCode}`);
    console.log(`   Total Count: ${benchmarksResponse.data.pagination?.totalCount || 0}`);
    console.log(`   Data Items: ${benchmarksResponse.data.data?.length || 0}`);
    console.log(benchmarksResponse.statusCode === 200 ? '   ✅ PASSED\n' : '   ❌ FAILED\n');

    // Test 6: Filtered Benchmarks
    console.log('6️⃣  Testing filtered benchmarks...');
    const filteredResponse = await makeRequest('GET', '/api/benchmarks?circuit=Poseidon&platform=Android');
    console.log(`   Status: ${filteredResponse.statusCode}`);
    console.log(`   Filtered Count: ${filteredResponse.data.pagination?.totalCount || 0}`);
    console.log(filteredResponse.statusCode === 200 ? '   ✅ PASSED\n' : '   ❌ FAILED\n');

    console.log('✨ All tests completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('   Make sure the backend server is running on http://localhost:5000');
  }
}

runTests();
