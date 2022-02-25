const {readFileSync, writeFileSync} = require('fs');

const pretranslate = require('./md2xliff-fork/pretranslate.js');

const {mockData} = require('./constants');

try {
	mockData.forEach(({
		xlfFileName,
	}) => {
		const {sourceLang, targetLang} = data;

		const xliff = readFileSync(xlfFileName);

		const apiKey = process.env.TRANSLATOR_API_KEY;

		pretranslate(xliff, {sourceLang, targetLang, apiKey}, (ctx, xliffEdited) => {
			writeFileSync(xlfFileName, xliffEdited)

		});
	})
} catch (e) {
	console.log(e);
}
