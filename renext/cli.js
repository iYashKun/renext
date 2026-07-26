import fs from 'fs';
import path from 'path';
import { parseDirectives } from './compiler.js';

const command = process.argv[2];

if (command === 'build') {
  console.log('Building renext app...');
  
  const pagesDir = path.resolve(process.cwd(), 'src/pages');
  const files = fs.readdirSync(pagesDir);

  files.forEach((file) => {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');    
    const { hasUseCache, hasUseChunks, transformedCode } = parseDirectives(content);

    console.log(`[renext Compiler] Processed ${file} -> Cache: ${hasUseCache}, Chunks: ${hasUseChunks}`);
  });

  console.log('Build completed! Assets target set to /_renext/');
} else if (command === 'dev') {
  console.log('Starting renext Dev Server...');
  import('../server.js');
}
