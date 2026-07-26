import express from 'express';
import path from 'path';
import fs from 'fs';

const renextCacheStore = new Map();

export function createReNextApp(config = {}) {
  const app = express();
  const assetPrefix = config.assetPrefix || '/_renext';
  const outDir = config.outDir || '.renext';

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const staticPath = path.resolve(process.cwd(), outDir, 'static');
  if (!fs.existsSync(staticPath)) {
    fs.mkdirSync(staticPath, { recursive: true });
  }
  app.use(`${assetPrefix}`, express.static(staticPath));
  app.use((req, res, next) => {
    const cacheKey = req.originalUrl;

    if (renextCacheStore.has(cacheKey)) {
      res.setHeader('X-renext-Cache', 'HIT');
      return res.send(renextCacheStore.get(cacheKey));
    }

    res.cacheResponse = (htmlContent) => {
      renextCacheStore.set(cacheKey, htmlContent);
      res.setHeader('X-renext-Cache', 'MISS-STORED');
      res.send(htmlContent);
    };

    next();
  });

  return app;
}
