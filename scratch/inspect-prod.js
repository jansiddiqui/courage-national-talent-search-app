async function inspect() {
  try {
    const res = await fetch("https://thecouragelibrary.com", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    console.log("=== HTTP HEADERS ===");
    for (const [k, v] of res.headers.entries()) {
      console.log(`${k}: ${v}`);
    }

    const html = await res.text();
    console.log("\n=== HTML SCAN ===");
    console.log("Status:", res.status);
    console.log("HTML Length:", html.length);
    console.log("Includes '1078403654595830':", html.includes("1078403654595830"));
    console.log("Includes 'fbevents':", html.includes("fbevents"));
    console.log("Includes 'connect.facebook.net':", html.includes("connect.facebook.net"));
    console.log("Includes 'meta-pixel':", html.includes("meta-pixel"));
    console.log("Includes 'fbq':", html.includes("fbq"));
    console.log("Includes 'googletagmanager':", html.includes("googletagmanager"));

    // Find script tags
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log("\n=== SCRIPT TAGS FOUND (" + scriptMatches.length + ") ===");
    scriptMatches.forEach((s, idx) => {
      console.log(`\n--- SCRIPT ${idx + 1} ---`);
      console.log(s.slice(0, 300));
    });

    // Check JS bundle links
    const srcMatches = html.match(/src="([^"]+\.js[^"]*)"/gi) || [];
    console.log("\n=== JS CHUNKS (" + srcMatches.length + ") ===");
    srcMatches.slice(0, 10).forEach(s => console.log(s));

    // Let's fetch one or two JS chunks to search for pixel ID
    for (const chunkMatch of srcMatches.slice(0, 5)) {
      const chunkUrl = chunkMatch.replace(/^src="/, '').replace(/"$/, '');
      const fullUrl = chunkUrl.startsWith('http') ? chunkUrl : `https://thecouragelibrary.com${chunkUrl}`;
      try {
        const chunkRes = await fetch(fullUrl);
        const chunkText = await chunkRes.text();
        console.log(`\nChunk: ${fullUrl}`);
        console.log(`  Length: ${chunkText.length}`);
        console.log(`  Contains '1078403654595830': ${chunkText.includes("1078403654595830")}`);
        console.log(`  Contains 'fbevents': ${chunkText.includes("fbevents")}`);
        console.log(`  Contains 'NEXT_PUBLIC_META_PIXEL_ID': ${chunkText.includes("NEXT_PUBLIC_META_PIXEL_ID")}`);
      } catch (e) {
        console.log(`  Error fetching chunk:`, e.message);
      }
    }

  } catch (err) {
    console.error("Inspection error:", err);
  }
}

inspect();
