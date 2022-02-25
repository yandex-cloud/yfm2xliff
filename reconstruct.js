const {readFileSync, writeFileSync} = require('fs');

const reconstruct = require('./md2xliff-fork/xliff-reconstruct.js');

const {mockData} = require('./constants');

try {
	mockData.forEach(({
		translatedFileName,
		skeletonFileName,
		xlfFileName,
	}) => {
		const xliff = readFileSync(xlfFileName);
		const skeleton = readFileSync(skeletonFileName);

		reconstruct(xliff, skeleton, (ctx, reconstructed) => {
			writeFileSync(translatedFileName, reconstructed);
		});
	});
} catch (e) {
	console.log(e);
}
