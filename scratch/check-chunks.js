const https = require('https');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => resolve(data));
    }).on('error', (e) => reject(e));
  });
}

async function searchChunks() {
  try {
    const html = await getUrl('https://thecouragelibrary.com');
    const regex = /src="([^"]+\.js[^"]*)"/g;
    let match;
    const srcMatches = [];
    while ((match = regex.exec(html)) !== null) {
      srcMatches.push(match[1]);
    }
    console.log('Total JS chunks:', srcMatches.length);
    for (const src of srcMatches) {
      const url = src.startsWith('http') ? src : 'https://thecouragelibrary.com' + src;
      try {
        const text = await getUrl(url);
        const hasId = text.includes('1078403654595830');
        const hasFbEvents = text.includes('fbevents');
        const hasConnectFb = text.includes('connect.facebook.net');
        const hasFbq = text.includes('fbq');
        if (hasId || hasFbEvents || hasConnectFb || hasFbq) {
          console.log('FOUND MATCH in chunk:', url);
          console.log('  has 1078403654595830:', hasId);
          console.log('  has fbevents:', hasFbEvents);
          console.log('  has connect.facebook.net:', hasConnectFb);
          console.log('  has fbq:', hasFbq);
        }
      } catch (e) {
        console.error('Error fetching', url, e.message);
      }
    }
  } catch (err) {
    console.error('Initial fetch failed:', err.message);
  }
}

searchChunks();
