# The impact of functional first on birthing objects

In this library, most constructors are plain functions.  And while classes have since entered the language spec, they're not used much.  While thought was given rewriting types using class syntax, it soon became apparent this posed problems.

First, because Atomic is functional first, functions are preferred to methods.  Functions take an implicit subject, usually passed as the first argument, where methods omit the subject in favor of referencing `this`.

The library relies on functions and protocols (another flavor of functions).  They compose better than methods!  While possible to create functions from unbound methods (in order to use classes under the hood), doing so introduces a layer of indirection and overhead for no added benefit.

Secondly, although classes offer private properties and enforce strong encapsulation, this useful feature relies on methods.  Only methods owned by the instance can access private properties.  And, as stated, if having functions unneccesarily call methods degrades performance.

Encapsulation has been achieved through the discipline of using public functions (the contracted, public api) to access and operate against internal data.  Thus, properties have always been declared publicly, even if they were never meant for public consumption.  And, although it would be possible to use symbols as a means to keeping instance data truly private, doing so would be syntactically and aesthetically clunky.

Thus, the strategy for birthing objects remains:

* Create constructor functions but treat them as private (do no real work here)
* Make all properties public but treat them as private
* Define the public api using functions/protocols
* Create one or more factory functions for instantiating types using the private constructors (do real work here)
