# Placeholder Partial

Pipelines and partial application are commonplace in functional programs.  JavaScript is working toward [an operator](https://github.com/tc39/proposal-pipeline-operator) and [syntax](https://github.com/tc39/proposal-partial-application) but is overdue with its arrival.  They can be had, of course, with Babel plugins ([operator](https://babeljs.io/docs/babel-plugin-proposal-pipeline-operator) and [syntax](https://babeljs.io/docs/babel-plugin-proposal-partial-application)), but this necessitates a build step, the very thing Atomic wants to avoid.

This is ideally what one wants to write:
```js
  _.range(10)
    |> _.map(_.pipe(_.str("Number ", ?), _.lowerCase), ?)
    |> _.join(", ", ?)
    |> $.log;
```

Atomic provides `chain` for writing pipelines:
```js
  _.chain(_.range(10),
    x => _.map(_.pipe(y => _.str("Number ", y), _.lowerCase), x),
    x => _.join(", ", x),
    $.log);
```

It's a good alternative to the pipeline operator, but since it's not [point free](https://en.wikipedia.org/wiki/Tacit_programming) it's downright ugly.

One can use partial, [as underscore does](https://underscorejs.org/#partial), but it's too verbose to be practical for routine use:
```js
  _.chain(_.range(10),
    _.partial(_.map, _.pipe(_.partial(_.str, "Number ", _), _.lowerCase), _),
    _.partial(_.join, ", ", _),
    $.log);
```

If you regularly write in the tacit style, your modules can be [repackaged](/dist/atomic_/) as shadow modules.  These modules imbue exported functions with optional partial application via a feature called placeholder partial.

Add a trailing underscore to any folder exposing shadow modules to make them explicit.

With placeholder partial the tacit aesthetic is restored:
```js
  _.chain(_.range(10),
    _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
    _.join(", ", _),
    $.log);
```


