const zlib = require('zlib');
const https = require('https');

async function fetchFull(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });
  return await res.text();
}

async function run() {
  const html = await fetchFull("https://thecouragelibrary.com");
  console.log("HTML length:", html.length);
  
  // Look for all script tags in HTML
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let sMatch;
  let count = 0;
  while ((sMatch = scriptRegex.exec(html)) !== null) {
    count++;
    const fullTag = sMatch[0];
    const content = sMatch[1];
    const srcMatch = fullTag.match(/src="([^"]+)"/);
    if (srcMatch) {
      const src = srcMatch[1];
      const url = src.startsWith('http') ? src : `https://thecouragelibrary.com${src}`;
      try {
        const jsText = await fetchFull(url);
        if (jsText.includes('1078403654595830') || jsText.includes('fbevents') || jsText.includes('fbq')) {
          console.log(`\n>>> FOUND IN SCRIPT SRC ${src}:`);
          console.log("  has 1078403654595830:", jsText.includes('1078403654595830'));
          console.log("  has fbevents:", jsText.includes('fbevents'));
          console.log("  has fbq:", jsText.includes('fbq'));
          console.log("  Snippet around fbq:", jsText.substring(Math.max(0, jsText.indexOf('fbq') - 100), jsText.indexOf('fbq') + 200));
        }
      } catch (err) {
        console.log(`Failed fetching ${url}:`, err.message);
      }
    } else if (content) {
      if (content.includes('1078403654595830') || content.includes('fbq') || content.includes('fbevents')) {
        console.log(`\n>>> FOUND IN INLINE SCRIPT ${count}:`);
        console.log("  Content preview:", content.substring(0, 300));
      }
    }
  }

  // Also check RSC payload pushed to self.__next_f
  if (html.includes('MetaPixel') || html.includes('meta-pixel')) {
    console.log("Found MetaPixel reference in HTML!");
  } else {
    console.log("MetaPixel NOT found in HTML text search.");
  }
}

run();
