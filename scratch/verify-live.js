const https = require('https');

function fetchWithRedirects(initialUrl, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    function get(url, redirectsLeft) {
      if (redirectsLeft === 0) {
        return reject(new Error("Too many redirects"));
      }
      https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = res.headers.location.startsWith('http') 
            ? res.headers.location 
            : new URL(res.headers.location, url).href;
          console.log(`HTTP ${res.statusCode} redirecting from ${url} -> ${redirectUrl}`);
          return get(redirectUrl, redirectsLeft - 1);
        }

        let data = '';
        res.on('data', (d) => { data += d; });
        res.on('end', () => resolve({ finalUrl: url, status: res.statusCode, headers: res.headers, body: data }));
      }).on('error', (e) => reject(e));
    }

    get(initialUrl, maxRedirects);
  });
}

async function verifyLive() {
  console.log("=== LIVE PRODUCTION INSPECTION WITH REDIRECTS ===");
  try {
    const res = await fetchWithRedirects("https://thecouragelibrary.com");
    console.log("\nFinal URL:", res.finalUrl);
    console.log("HTTP Status:", res.status);
    console.log("Vercel Cache / Age:", res.headers['x-vercel-cache'], "| Age:", res.headers['age']);
    console.log("CSP Header present:", Boolean(res.headers['content-security-policy']));
    
    const html = res.body;
    console.log("HTML Size:", html.length);
    
    const hasConnectFb = html.includes("connect.facebook.net");
    const hasPixelId = html.includes("1078403654595830");
    const hasFbqInit = html.includes("fbq('init', '1078403654595830')") || (html.includes("fbq") && html.includes("1078403654595830"));
    const hasFbqPageView = html.includes("fbq('track', 'PageView')") || html.includes("fbq(\"track\", \"PageView\")");
    const hasNoScript = html.includes("https://www.facebook.com/tr?id=1078403654595830&amp;ev=PageView&amp;noscript=1") || html.includes("facebook.com/tr?id=1078403654595830");

    console.log("\n--- Checks on Final HTML ---");
    console.log("1. Contains 'connect.facebook.net':", hasConnectFb);
    console.log("2. Contains Pixel ID '1078403654595830':", hasPixelId);
    console.log("3. Contains fbq('init', '1078403654595830'):", hasFbqInit);
    console.log("4. Contains fbq('track', 'PageView'):", hasFbqPageView);
    console.log("5. Contains noscript fallback beacon:", hasNoScript);

    const scriptIdx = html.indexOf("meta-pixel");
    if (scriptIdx !== -1) {
      console.log("\n--- Meta Pixel Script Snippet in Live HTML ---");
      console.log(html.substring(Math.max(0, scriptIdx - 60), scriptIdx + 400));
    } else {
      console.log("\n'meta-pixel' script id not found in HTML text directly, searching all script tags...");
      const scriptMatches = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi));
      console.log("Total <script> tags:", scriptMatches.length);
      for (const m of scriptMatches) {
        if (m[0].includes("1078403654595830") || m[0].includes("fbevents") || m[0].includes("fbq")) {
          console.log("\nFound in script tag:", m[0]);
        }
      }
    }

  } catch (err) {
    console.error("Live verification fetch failed:", err);
  }
}

verifyLive();
