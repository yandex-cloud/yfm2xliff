const esbuild = require('esbuild');
const {nodeExternalsPlugin} = require('esbuild-node-externals');

esbuild
    .build({
        entryPoints: ['index.js'],
        outfile: 'lib/esm/index.js',
        bundle: true,
        format: 'esm',
        platform: 'node',
        target: 'node12',
        plugins: [nodeExternalsPlugin()],
    })
    .catch(() => process.exit(1));
