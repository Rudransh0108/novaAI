self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("ruddi-virus").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fake glitch responses
self.addEventListener("fetch", event => {
  event.respondWith(
    new Response(`
      <html>
        <head><title>⚠️ SYSTEM BREACH ⚠️</title></head>
        <body style="background:black; color:lime; font-family:monospace; text-align:center;">
          <h1>☠️ RUDDI VIRUS INSTALLED ☠️</h1>
          <p>[ERROR] Files are being corrupted...</p>
          <p>[WARNING] Data leaking to remote server...</p>
          <p>[CRITICAL] Shutdown imminent...</p>
          <script>
            setInterval(()=>{document.body.style.background=["black","red","purple"][Math.floor(Math.random()*3)]},200);
          </script>
        </body>
      </html>
    `, {
      headers: {"Content-Type": "text/html"}
    })
  );
});
