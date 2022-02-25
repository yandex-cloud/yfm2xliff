const {resolve, join} = require('path');

const mocks = [
  'comments',
/*
	'notes',
	'cut',
	'tabs',
	'links',
	'meta',
	'yfmTable'
*/
];

const mockData = mocks.map((pluginName) => {
	const prefix = resolve(__dirname, './mock');

	return {
		markdownFileName: join(prefix, `${pluginName}/${pluginName}.md`),
		skeletonFileName: join(prefix, `${pluginName}/${pluginName}.skl.md`),
		xlfFileName: join(prefix, `${pluginName}/${pluginName}.xlf`),
		translatedFileName: join(prefix, `${pluginName}/${pluginName}.en.md`),
	};
});

module.exports = {
  mocks,
  mockData,
}
