async function testDeployApi() {
    console.log('Testing /api/deploy-vercel...');

    try {
        // 1. Test missing sandboxId
        const res1 = await fetch('http://localhost:3000/api/deploy-vercel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data1 = await res1.json();
        console.log('Test 1 (Missing ID):', res1.status === 400 && data1.error === 'No sandbox ID provided' ? 'PASSED' : 'FAILED', data1);

        // 2. Test non-existent sandboxId
        const res2 = await fetch('http://localhost:3000/api/deploy-vercel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sandboxId: 'non-existent' })
        });
        const data2 = await res2.json();
        console.log('Test 2 (Non-existent ID):', res2.status === 404 && data2.error === 'Sandbox not found or could not be reconnected' ? 'PASSED' : 'FAILED', data2);

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

testDeployApi();
