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

With placeholder partial the tacit aesthetic is restored:
```js
  _.chain(_.range(10),
    _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
    _.join(", ", _),
    $.log);
```

If you write in the tacit style, your modules can be [repackaged](/dist/atomic_/) as shadow modules.  These modules imbue exported functions with optional partial application via a feature called placeholder partial.

Atomic modules are reexported this way. The trailing underscore in the folder name makes the use explicit.  When defaults are imported from shadow modules, the feature's available for use.  When the modules are imported directly, it's not.

The reason for allowing the choice is the feature is made possible by decorating functions, which adds a little overhead to calling them.  All this gets you partial application minus a build step.  If you're building anyway, there's no point.

```js
//placeholder partial wanted
import _ from "./libs/atomic_/core.js"; //the universal placeholder character
import $ from "./libs/atomic_/shell.js";
import dom from "./libs/atomic_/dom.js";

//placeholder partial not wanted
import * as _ from "./libs/atomic/core.js";
import * as $ from "./libs/atomic/shell.js";
import * as dom from "./libs/atomic/dom.js";
```

Placeholder partial is preferred to currying due to the library's Clojure-like preference for varadic functions.  Currying works best with fixed-arity, not variadic functions.  Placeholder partial (`e.g. const double = _.mult(2, _)`) clearly identifies which overloaded arity is targeted by the function call.
