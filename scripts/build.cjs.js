const esbuild = require('esbuild');
const {nodeExternalsPlugin} = require('esbuild-node-externals');

esbuild
    .build({
        entryPoints: ['index.js'],
        outfile: 'lib/cjs/index.js',
        bundle: true,
        format: 'cjs',
        minify: true,
        platform: 'node',
        sourcemap: true,
        target: 'node14',
        plugins: [nodeExternalsPlugin()],
    })
    .catch(() => process.exit(1));
