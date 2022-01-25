const {readFileSync, writeFileSync} = require('fs');

const lexer = require('./yfm-transform-fork/lexer.js');
const extract = require('./md2xliff-fork/extract.js');

const pluginsMockData = require('./constants');

try {
	pluginsMockData.forEach(({
		markdownFileName,
		skeletonFileName,
		xlfFileName,
	}) => {
		const markdownStr = readFileSync(markdownFileName, 'utf8');

		const {xliff, skeleton} = extract(
			markdownStr,
			markdownFileName,
			null,
			null,
			null,
			{
				lexer,
			});

		writeFileSync(skeletonFileName, skeleton);
		writeFileSync(xlfFileName, xliff);
	});
} catch (e) {
	console.log(e);
}
