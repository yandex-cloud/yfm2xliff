import sys
from razdel import sentenize
import functools

def compose(*functions):
    def compose2(f, g):
        return lambda x: f(g(x))
    return functools.reduce(compose2, functions, lambda x: x)

extract = lambda s: s.text
output = compose(print, extract)

[output(sentence) for sentence in sentenize(sys.argv[1])]
