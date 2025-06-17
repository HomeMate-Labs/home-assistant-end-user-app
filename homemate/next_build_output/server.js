// server.js
const express = require('express');
const next = require('next');

const app = next({
  dev: process.env.NODE_ENV !== 'production'
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // server.use((req, res, nextMiddleware) => {
  //   // Dynamically set assetPrefix for this request
  //   const referer = req.headers.referer || '';
  //   const originalUri = req.headers['x-original-uri'] || '';
  //   const ingressBase1 = req.url.match(
  //     /^\/api\/hassio_ingress\/([a-zA-Z0-9-_]+)/
  //   );
  //   const ingressBase2 = referer.match(
  //     /^\/api\/hassio_ingress\/([a-zA-Z0-9-_]+)/
  //   );
  //   const ingressBase3 = originalUri.match(
  //     /^\/api\/hassio_ingress\/([a-zA-Z0-9-_]+)/
  //   );
  //   const ingressPathHeader = req.headers['x-ingress-path'];

  //   const match = ingressPathHeader?.match(
  //     /^\/api\/hassio_ingress\/[a-zA-Z0-9-_]+/
  //   );
  //   console.log(
  //     'Request url',
  //     req.url,
  //     referer,
  //     originalUri,
  //     ingressBase1,
  //     ingressBase2,
  //     ingressBase3,
  //     match
  //   );
  //   // if (ingressBase1) {
  //   //   const basePath = `/api/hassio_ingress/${ingressBase1[1]}`;
  //   //   app.setAssetPrefix(basePath);
  //   // } else {
  //   //   app.setAssetPrefix('');
  //   // }
  //   if (match && match[0]) {
  //     const basePath = match[0];
  //     console.log('🛠️ Setting assetPrefix to:', basePath);
  //     app.setAssetPrefix(basePath);
  //   } else {
  //     app.setAssetPrefix('');
  //   }
  //   nextMiddleware();
  // });

  server.all('*', (req, res) => {
        // Dynamically set assetPrefix for this request
    const referer = req.headers.referer || '';
    const originalUri = req.headers['x-original-uri'] || '';
    const ingressBase1 = req.url.match(
      /^\/api\/hassio_ingress\/([a-zA-Z0-9-_]+)/
    );
    const ingressBase2 = referer.match(
      /^\/api\/hassio_ingress\/([a-zA-Z0-9-_]+)/
    );
    const ingressBase3 = originalUri.match(
      /^\/api\/hassio_ingress\/([a-zA-Z0-9-_]+)/
    );
    const ingressPathHeader = req.headers['x-ingress-path'];

    const match = ingressPathHeader?.match(
      /^\/api\/hassio_ingress\/[a-zA-Z0-9-_]+/
    );
    console.log(
      'Server all Request url',
      req.url,
      referer,
      originalUri,
      ingressBase1,
      ingressBase2,
      ingressBase3,
      match    
    );
    // if (ingressBase1) {
    //   const basePath = `/api/hassio_ingress/${ingressBase1[1]}`;
    //   app.setAssetPrefix(basePath);
    // } else {
    //   app.setAssetPrefix('');
    // }
    if (match && match[0]) {
      const basePath = match[0];
      console.log('🛠️ Setting assetPrefix to:', basePath);
      app.setAssetPrefix(basePath);
    } else {
      app.setAssetPrefix('');
    }
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
