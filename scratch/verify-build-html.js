const fs = require('fs');
const path = require('path');

function inspectBuildHtml() {
  const htmlFiles = [
    path.join(__dirname, '..', '.next', 'server', 'app', 'index.html'),
    path.join(__dirname, '..', '.next', 'server', 'app', 'about.html'),
    path.join(__dirname, '..', '.next', 'server', 'app', 'faq.html'),
    path.join(__dirname, '..', '.next', 'server', 'app', 'register.html')
  ];

  for (const filePath of htmlFiles) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      console.log(`=== File: ${path.basename(filePath)} ===`);
      console.log('Size:', content.length);
      console.log("Includes 'connect.facebook.net':", content.includes("connect.facebook.net"));
      console.log("Includes 'fbq(\\'init\\', \\'1078403654595830\\')':", content.includes("fbq('init', '1078403654595830')"));
      console.log("Includes 'fbq(\\'track\\', \\'PageView\\')':", content.includes("fbq('track', 'PageView')"));
      console.log("Includes '<noscript>':", content.includes("https://www.facebook.com/tr?id=1078403654595830&ev=PageView&noscript=1"));

      // Extract the script snippet
      const metaPixelIdx = content.indexOf('meta-pixel');
      if (metaPixelIdx !== -1) {
        console.log('\nSnippet in HTML:');
        console.log(content.substring(Math.max(0, metaPixelIdx - 50), metaPixelIdx + 450));
      }
      console.log('\n----------------------------------------\n');
    } else {
      console.log(`File not found: ${filePath}`);
    }
  }
}

inspectBuildHtml();
