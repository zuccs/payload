import bundleAnalyzer from '@next/bundle-analyzer'

import withPayload from './packages/next/src/withPayload.js'
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

function withNodeNext(config) {
  const extensionAlias = config.experimental?.extensionAlias?.['.js'] || [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
  ];

  const resolveAlias = fg
    .globSync(['packages/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'])
    .reduce((acc, file) => {
      // For each file, read contents and look for import and export statements ending with ".js"
      const contents = fs.readFileSync(file, 'utf8');

      // Match both static and dynamic import/export statements with ".js"
      const imports = contents.match(/(import\s+.*\s+from\s+['"].*\.js['"])|(export\s+.*\s+from\s+['"].*\.js['"])|(import\(['"].*\.js['"]\))/g);

      if (file.includes('utilities/telemetry/events/serverInit')) {
        console.log('-----', file, imports)
      }

      if (!imports) {
        return acc;
      }

      for (const imp of imports) {
        // Capture both static and dynamic paths from import/export statements
        const match = imp.match(/(?:import|export)\s+.*\s+from\s+['"](.*\.js)['"]|import\(['"](.*\.js)['"]\)/);

        if (!match) {
          continue;
        }

        const [, staticMatchedPath, dynamicMatchedPath] = match;
        const matchedPath = staticMatchedPath || dynamicMatchedPath;

        if (!matchedPath) {
          continue;
        }

        let debug = false;

        if(file.includes('utilities/telemetry/events/serverInit') || file.includes('gergreg')) {
          debug = true;
          console.log('0000', file, matchedPath);
        }

        for (const extensionAliasItem of extensionAlias) {
          const extPath = matchedPath.replace(/\.js$/, extensionAliasItem);
          const extPathRelativeToFile = path.resolve(path.dirname(file), extPath);
          const extExists = fs.existsSync(extPathRelativeToFile);
          if (extExists) {
            let xx =  extPathRelativeToFile.replace(process.cwd(), '.')
            if(xx.startsWith('./')) {
              //xx = xx.slice(2);
            }
            acc[matchedPath] = xx
            if(debug) {
              console.log('111matchedPath', matchedPath);
              console.log('111extPathRelativeToFile', xx);
            }
            break;
          } else if(extensionAliasItem === '.jsx') { // jsx => last try
            acc[matchedPath] = matchedPath.replace(/\.js$/, '.ts');
            if(debug) {
              console.log('222matchedPath', matchedPath);
              console.log('222extPath', extPath);
              console.log('222extPathRelativeToFile', extPathRelativeToFile);

              console.log('222extPathRelativeToFile', matchedPath.replace(/\.js$/, '.ts'));
            }
          }
        }
      }

      return acc;
    }, {});

  return {
    ...config,
    experimental: {
      ...(config.experimental || {}),
      turbo: {
        ...(config.experimental?.turbo || {}),
        resolveAlias: {
          ...(config.experimental?.turbo?.resolveAlias || {}),
          ...resolveAlias,
        },
      },
    },
  };
}

// eslint-disable-next-line no-restricted-exports
export default withNodeNext(withPayload({
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    async redirects() {
      return [
        {
          destination: '/admin',
          permanent: true,
          source: '/',
        },
      ]
    },
    images: {
      domains: ['localhost'],
    },
    webpack: (webpackConfig) => {
      webpackConfig.resolve.extensionAlias = {
        '.cjs': ['.cts', '.cjs'],
        '.js': ['.ts', '.tsx', '.js', '.jsx'],
        '.mjs': ['.mts', '.mjs'],
      }

      return webpackConfig
    },
  }),
)
