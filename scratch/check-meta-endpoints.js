const https = require('https');

function checkEndpoint(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.thecouragelibrary.com/'
      }
    }, (res) => {
      resolve({ url, status: res.statusCode, contentType: res.headers['content-type'] });
    }).on('error', (e) => resolve({ url, status: 'ERROR', error: e.message }));
  });
}

async function runNetworkChecks() {
  console.log("=== CHECKING EXTERNAL META ENDPOINTS ===");
  
  const fbevents = await checkEndpoint("https://connect.facebook.net/en_US/fbevents.js");
  console.log("1. connect.facebook.net/en_US/fbevents.js -> Status:", fbevents.status, "| Type:", fbevents.contentType);

  const trBeacon = await checkEndpoint("https://www.facebook.com/tr/?id=1078403654595830&ev=PageView&noscript=1");
  console.log("2. facebook.com/tr (PageView beacon) -> Status:", trBeacon.status, "| Type:", trBeacon.contentType);
}

runNetworkChecks();
