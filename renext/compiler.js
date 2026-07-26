import parser from '@babel/parser';
import traverse from '@babel/traverse';

export function parseDirectives(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });

  let hasUseCache = false;
  let hasUseChunks = false;

  traverse.default(ast, {
    Directive(path) {
      if (path.node.value.value === 'use cache') {
        hasUseCache = true;
      }
      if (path.node.value.value === 'use chunks') {
        hasUseChunks = true;
      }
    }
  });

  return {
    hasUseCache,
    hasUseChunks,
    transformedCode: `
      export const __renext_meta = {
        hasCache: ${hasUseCache},
        hasChunks: ${hasUseChunks}
      };
      ${code}
    `
  };
}
