import http from 'http';

const data = JSON.stringify({
    name: 'Debug User',
    firmName: 'Debug Firm',
    email: 'debug@example.com',
    phone: '1234567890',
    address: 'Debug Address',
    gstNumber: 'GST123',
    description: 'Debug Description'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/customer/new-customer',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Response:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
