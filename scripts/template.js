const render = (template, data) =>
    template.replace(
        /{{(.*?)}}/g,
        (match) => data[match.split(/{{|}}/).filter(Boolean)[0].trim()] ?? match,
    );

module.exports = {render};
