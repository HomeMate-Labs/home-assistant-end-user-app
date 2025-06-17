// server.js
const express = require('express');
const next = require('next');

const app = next({
  dev: process.env.NODE_ENV !== 'production'
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use((req, res, nextMiddleware) => {
    // Dynamically set assetPrefix for this request
    const ingressBase = req.url.match(
      /^\/api\/hassio_ingress\/([a-zA-Z0-9-_]+)/
    );
    console.log('Request url', req.url, ingressBase);
    if (ingressBase) {
      const basePath = `/api/hassio_ingress/${ingressBase[1]}`;
      app.setAssetPrefix(basePath);
    } else {
      app.setAssetPrefix('');
    }
    nextMiddleware();
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
