const {resolve, join} = require('path');

const pluginsMockData = [
	'notes',
	'cut',
	'tabs',
	'links',
	'meta',
	'yfmTable'
].map((pluginName) => {
	const prefix = resolve(__dirname, './mock');

	return {
		markdownFileName: join(prefix, `${pluginName}/test.md`),
		skeletonFileName: join(prefix, `${pluginName}/test.skl.md`),
		xlfFileName: join(prefix, `${pluginName}/test.xlf`),
		translatedFileName: join(prefix, `${pluginName}/test.en.md`),
	};
});

module.exports = pluginsMockData;
