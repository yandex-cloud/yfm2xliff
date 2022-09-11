const esbuild = require('esbuild');
const {nodeExternalsPlugin} = require('esbuild-node-externals');

esbuild
    .build({
        entryPoints: ['index.js'],
        outfile: 'lib/cjs/index.js',
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: ['node12'],
        plugins: [nodeExternalsPlugin()],
    })
    .catch(() => process.exit(1));
