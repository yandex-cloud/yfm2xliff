const {compose, replace} = require('ramda');

const strip = compose(
    // wrap yaml values with variables in the single quotes '
    // preventing yaml parser from failing
    // eslint-disable-next-line
    replace(/(?<![:-])([:-]\s)((?:\{\{).+(?=\n))/g, "$1'$2'"),
    // include, code, if, for directives
    replace(/\{%\s(include|code|if|else|endif|for|endfor)\s[^{]*%\}/g, ''),
    // eslint-disable-next-line security/detect-unsafe-regex
    replace(/(?<!\s)[^\S\r\n]*\{%\s(include|code|if|else|endif|for|endfor)\s[^{]*%\}/g, '\n'),
    // inline LaTex directives
    replace(/\$[\S$]*\$(?!\d)/g, '\n'),
    // multiline LaTex directives
    replace(/\$\$\\begin[^$]*?\\end[^$]*?\$\$/g, '\n'),
    // graphviz directives
    replace(/%%\(graphviz[^%]*?%%/g, '\n'),
    // plantuml directives
    replace(/@startuml[^@]*?@enduml/g, '\n'),
);

const normalize = compose(
    replace(/\u2424/g, '\n'),
    replace(/\u00a0/g, ' '),
    replace(/\t/g, '    '),
    replace(/\r?\n|\r/g, '\n'),
);

const preprocess = compose(strip, normalize);

module.exports = {
    preprocess,
    normalize,
};
