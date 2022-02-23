const render = (template, data) => {
    return template.replace(/{{(.*?)}}/g, (match) => {
        return data[match.split(/{{|}}/).filter(Boolean)[0].trim()]
    })
}

module.exports = { render };
