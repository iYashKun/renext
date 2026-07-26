import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static';

export class renextApp extends Hono {
  constructor() {
    super();    
    this.use('/_renext/*', serveStatic({ root: './.renext/static' }));
  }
}

export * from 'hono';
