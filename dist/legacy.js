var Cloe = (function(){

  var unbind  = Function.call.bind(Function.bind, Function.call);
  var slice   = unbind(Array.prototype.slice);
  var reverse = unbind(Array.prototype.reverse);

  function curry(len, f, applied){
    return typeof len === "function" ? curry(len.length, len) : function(){
      //a call without args applies a default as defined by the curried function.
      var args = (applied || []).concat(arguments.length === 0 ? [undefined] : slice(arguments));
      if (args.length >= len) {
        return f.apply(this, args);
      } else {
        return curry.call(this, len - arguments.length, f, args);
      }
    }
  }

  var isInstanceOf = curry(function(constructor, obj){
    return obj instanceof constructor;
  });

  var isType = curry(function(name, obj){
    return typeof obj === name;
  });

  var isNumber    = isType('number');
  var isString    = isType('string');
  var isFunction  = isType('function');
  var isUndefined = isType('undefined');
  var isArray     = Array.isArray;

  function isObject(obj){
    return isType('object', obj) && !isArray(obj);
  }

  function isArguments(obj){
    return !!obj.callee;
  }

  function constantly(value){
    return function(){
      return value;
    }
  }

  function counter(start, step){
    step || (step = 1);
    var count = (start || 0) + (step * -1);
    return function(){
      count += step;
      return count;
    }
  }

  function promise(obj){
    return obj.promise ? obj : $.Deferred(function(dfd){
      dfd.resolve(obj);
    }).promise();
  }

  function mergeObject(a, b){
    var keys = Object.keys(b), l = keys.length, i = 0;
    while(i < l){
      var key = keys[i];
      a[key] = b[key];
      i++;
    }
    return a;
  }

  function identity(obj){
    return obj;
  }

  function not(value){
    return !value;
  }

  function toBool(value){
    return !!value;
  }

  function Node(head, tail){ //in lieu of ES6 generators
    this.head = head;
    this.tail = tail;
  }

  function cons(head, tail){
    return new Node(head, tail);
  }

  function Reduced(value){
    this.deref = constantly(value);
  }

  function reduced(value){
    return new Reduced(value);
  }

  var isReduced = isInstanceOf(Reduced);

  function Signal(value){
    this.value = value;
    this.callbacks = [];
    this.on = bind(this.on, this);
  }

  Signal.prototype.on = function(){
    if (arguments.length > 0){
      this.callbacks = concat(this.callbacks, arguments);
      each(invokeWith(this.value), arguments);
    }
    return this;
  }

  Signal.prototype.off = function(){
    var removing = arguments;
    this.callbacks = arguments.length === 0 ? [] : remove(function(callback){
      return contains(removing, callback);
    }, this.callbacks);
    return this;
  }

  function signal(value){
    return new Signal(value);
  }
  
  var MAX_INT = 9007199254740992;
  var MIN_INT = MAX_INT * -1;
  var TRUE    = constantly(true);
  var FALSE   = constantly(false);

  function noop(){
  }

  function realize(v){
    return isFunction(v) ? realize(v()) : v;
  }

  function complement(f){
    return function(){
      return !f.apply(this, arguments);
    }
  }

  function array(){
    return [];
  }

  function object(){
    return {};
  }

  function applying(f){
    return function(){
      return f.call(this, slice(arguments));
    }
  }

  function variadic(){
    var fs = arguments, catchall = last(arguments), forward; //consider that some callbacks return more values than the caller cares to handle (an `each` iterator, for example provides value, key, coll)
    function variadic(){
      return (fs[arguments.length] || catchall).apply(this, arguments);
    }
    //excluding arity 0, fill in arity gaps with self-currying functions
    for(var i = fs.length - 1; i > 0; i--){
      if (fs[i]) {
        forward = curry(i + 1, variadic);
      } else {
        fs[i] = forward;
      }
    }
    return variadic;
  }

  function first(items, len){
    return len ? slice(items, 0, len) : items[0];
  }

  function last(items, len){
    return len ? slice(items, items.length - len) : items[items.length - 1];
  }

  function rest(items, idx){
    return Array.prototype.slice.call(items, idx || 1);
  }

  function initial(items, offset){
    return slice(items, 0, items.length - (offset || 1));
  }

  var mechanize = curry(function(f, value){
    return isFunction(value) ? value : f(value);
  });

  function property(key){
    return function(obj){
      return obj[key];
    }
  }

  function lookup(obj){
    return function(key){
      return obj[key];
    }
  }

  var arity = curry(function arity(len, f){
    return function(){
      return f.apply(this, first(arguments, len));
    }
  });

  var unary  = arity(1);
  var binary = arity(2);

  var alternate = curry(function(alt, value){
    return value || alt;
  });

  var subtract = curry(function(a, b){
    return a - b;
  });

  var eq = curry(function(a, b){
    return a === b;
  });

  var ne = curry(function(a, b){
    return a !== b;
  });

  var lt = curry(function(a, b){
    return a < b;
  });

  var gt = curry(function(a, b){
    return a > b;
  });

  var lte = curry(function(a, b){
    return a <= b;
  });

  var gte = curry(function(a, b){
    return a >= b;
  });

  function even(n){
    return n % 2 == 0;
  }

  var odd = complement(even);

  //aka. reducing function, xf for short
  var reducer = variadic(null, function(step){
    return step.reducer ? step : reducer(noop, step);
  }, function(seed, step){
    return reducer(seed, identity, step)
  }, function(seed, result, step){
    function reducing(memo){
      return reduce(step, memo, rest(arguments));
    }
    var t = variadic(seed, result, step, reducing);
    t.reducer = true;
    return t;
  });

  var chain = reducer(constantly(identity), function(value, f){
    return f(value);
  });

  var concat = reducer(array, function(a, b){
    return slice(a).concat(slice(b)); //an arguments object or an array
  });

  var prepend = reducer(array, function(a, b){
    return concat([b], a);
  });

  var add = reducer(constantly(0), function(a, b){
    return a + b;
  });

  var and = reducer(constantly(TRUE), function(a, b){
    return function(){
      return a.apply(this, arguments) && b.apply(this, arguments);
    }
  });

  var or = reducer(constantly(FALSE), function(a, b){
    return function(){
      return a.apply(this, arguments) || b.apply(this, arguments);
    }
  });

  var relay = reducer(signal, identity, function(signal, value){
    var was = signal.value;
    signal.value = value;
    each(function(callback){
      callback(value, was);
    }, signal.callbacks);
    return signal;
  });

  function indexBy(key, val){
    key = mechanize(property, key);
    val = mechanize(property, val || identity);
    return reducer(function(){
      return {};
    }, function(memo, obj){
      memo[key(obj)] = val(obj);
      return memo;
    });
  }

  function effect(f, values){
    return reduce(function(memo, value){
      return f(value);
    }, undefined, values);
  }

  function each(f, values){
    effect(f, values);
    return values;
  }

  function prefer(pred){
    return function better(a, b){
      return pred(a, b) ? a : b;
    }
  }

  var min = reducer(constantly(MAX_INT), prefer(lt));
  var max = reducer(constantly(MIN_INT), prefer(gt));
  var isIterable = or(isArray, isArguments);

  var best = variadic(null, null, function(better, xs){
    return best(better, better(), xs);
  }, function(better, init, xs){
    return reduce(better, init, xs);
  });

  function str(){
    return slice(arguments).join("");
  }
  str.reducer = true;

  function bind(method, obj){
    var f    = isFunction(method) ? method : obj[method];
    var args = rest(arguments, 2);
    return function(){
      return f.apply(obj, concat(args, arguments));
    }
  }

  function MultimethodDispatchError(dispatch, value, targets, args){
    this.message = "Unhandled multimethod dispatch";
    this.dispatch = dispatch;
    this.value = value;
    this.targets = targets;
    this.args = args;
  }

  function multimethod(dispatch, catchall){
    var targets = []; //TODO ES6 Map?
    function method(){
      var value = dispatch.apply(this, arguments);
      var f = (find(function(implementation){
        return implementation[0] === value; //TODO isa?
      }, targets) || [])[1] || catchall || function(){
        throw new MultimethodDispatchError(dispatch, value, targets, arguments);
      };
      return f.apply(this, arguments);
    }
    function on(){
      targets = reduce(append, targets, slice(arguments));
      return this;
    }
    function off(){
      targets = remove(contains(slice(arguments)), targets);
      return this;
    }
    return merge(method, {on: on, off: off});
  }

  var Arguments = {}; //proxy for Argument protocols

  function constructor(obj){
    return obj.callee ? Arguments : obj.constructor;
  }

  function protocol(){
    var uuid = guid();
    var implement = variadic(null, function(c){
      return c.protocols[uuid];
    }, function(){
      var constructors = initial(arguments), implementations = last(arguments);
      for(var i in constructors){
        var c = constructors[i];
        c.protocols       || (c.protocols = {});
        c.protocols[uuid] || (c.protocols[uuid] = {});
        mergeObject(c.protocols[uuid], implementations);
      }
    });
    function forward(name){
      function resolve(obj){
        return constructor(obj).protocols[uuid][name];
      }
      return function(obj){
        return obj === protocol ? resolve : constructor(obj).protocols[uuid][name].apply(this, arguments);
      }
    }
    for(var idx in arguments){
      implement[arguments[idx]] = forward(arguments[idx]);
    }
    return implement;
  }

  Set = Set || (function(){
    function Set(values){
      this.values = values;
    }
    merge(Set.prototype, {
      add: function(value){
        this.has(value) || this.values.push(value);
        return this;
      },
      has: function(value){
        return contains(this.values, value);
      }
    });
    return Set;
  })();

  var Contains = protocol('contains');
  var contains = curry(2, Contains.contains);

  Contains(Number, {
    contains: eq
  });

  Contains(Node, {
    contains: function(xs, x){
      return !!find(eq(x), xs);
    }
  });

  Contains(Array, String, {
    contains: function(xs, x){
      return xs.indexOf(x) > -1;
    }
  });

  Contains(Arguments, {
    contains: function(xs, x){
      return slice(xs).indexOf(x) > -1;
    }
  });

  Contains(Object, {
    contains: function(obj, attrs){
      var keys = Object.keys(attrs), len = keys.length;
      if (obj == null) return !len;
      var obj = Object(obj);
      for (var i = 0; i < len; i++) {
        var key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    }
  });

  var matches = flip(contains);

  var Append = protocol('append');

  Append(Object, {
    append: function(obj, value){
      if (!isArray(value))
        return reduce(append, obj, value);
      var pair = value;
      obj[pair[0]] = pair[1];
      return obj;
    }
  });

  Append(Array, {
    append: function(arr, value){
      return arr.concat([value]);
    }
  });

  Append(Arguments, {
    append: function(args, value){
      return slice(args).concat([value]);
    }
  });

  Append(Set, {
    append: function(set, value){
      return set.add(value);
    }
  });

  Append(Node, {
    append: reducer(constantly(cons()), function(node){
      return node.head !== undefined ? node : undefined;
    }, function(node, value){
      return node.head !== undefined ? cons(value, constantly(node)) : cons(value, noop);
    })
  });

  var append = reducer(array, Append.append);

  var seqObject = variadic(null, function(obj){
    return seqObject(obj, Object.keys(obj));
  }, function(obj, keys){
    if (keys.length > 0)
      return cons([keys[0], obj[keys[0]]], partial(seqObject, obj, rest(keys)));
  });

  var seqArray = variadic(null, function(arr){
    return seqArray(arr, 0);
  }, function(arr, idx){
    if (idx < arr.length)
      return cons(arr[idx], partial(seqArray, arr, idx + 1));
  });

  var Seq = protocol('seq');

  Seq(Node, {
    seq: identity
  });

  Seq(Object, {
    seq: seqObject
  });

  Seq(Array, Arguments, {
    seq: seqArray
  });

  var union = reducer(set, function(a, b){
    var c = new Set(), v;
    for(v of a){
      c.add(v);
    }
    for(v of b){
      c.add(v);
    }
    return c;
  });

  var mergeNode = reducer(function(a, b){
    return cons(a.head, function(){
      var tail = a.tail();
      return tail ? mergeNode(tail, b) : b;
    });
  });

  function reduceNode(node, xf, init){
    var memo = init;
    while(node && !isReduced(memo)){
      memo = xf(memo, node.head);
      node = node.tail();
    }
    return xf(isReduced(memo) ? memo.deref() : memo);
  }

  function reduceObject(obj, xf, init){
    var memo = init, keys = Object.keys(obj), l = keys.length, i = 0;
    while(i < l && !isReduced(memo)){
      memo = xf(memo, [keys[i], obj[keys[i]]]);
      i++;
    }
    return xf(isReduced(memo) ? memo.deref() : memo);
  }

  function reduceArray(xs, xf, init){
    var memo = init, l = xs.length, i = 0;
    while(i < l && !isReduced(memo)){
      memo = xf(memo, xs[i]);
      i++;
    }
    return xf(isReduced(memo) ? memo.deref() : memo);
  }

  var extend = reducer(object, mergeObject);

  var mergeSignal = variadic(signal, identity, function(){
    var s = signal(), emit = slot(s);
    each(invoke('on', emit), arguments);
    return s;
  });
  mergeSignal.reducer = true;

  var Reduce = protocol('reduce','merge');

  Reduce(Function, {
    merge: pipe,
    reduce: function(f, xf, init){
      return reduce(xf, init, f());
    }
  });

  Reduce(Node, {
    merge: mergeNode,
    reduce: reduceNode
  });

  Reduce(Object, {
    merge: extend,
    reduce: reduceObject
  });

  Reduce(Array, {
    merge: concat,
    reduce: reduceArray
  });

  Reduce(String, {
    merge: str,
    reduce: reduceArray
  });

  Reduce(Arguments, {
    merge: concat,
    reduce: function(args, xf, init){
      return reduceArray(slice(args), xf, init);
    }
  });

  Reduce(Set, {
    merge: union,
    reduce: reduceArray
  });

  Reduce(Signal, {
    merge: mergeSignal
  });

  var merge = Reduce.merge;
  var reduce = variadic(null, null, function(xf, coll){
    return reduce(xf, xf(), coll);
  }, function(xf, init, coll){
    return Reduce.reduce(coll, reducer(xf), init);
  });

  var value = variadic(null, function(ctl){
    return value(ctl, function(ctl){
      return ctl.val();
    });
  }, function(ctl, f){
    var s = signal(), emit = slot(map(f), s);
    ctl.on('change', function(){
      emit(ctl);
    });
    return s;
  });

  function selected(select, method){ //broadcast dropdown selections
    method || (method = 'text');
    return value(select, function(ctl){
      return $("option:selected", ctl)[method]();
    });
  }  

  var via = curry(function(xf, source){
    var s = signal(), emit = slot(xf, s);
    source.on(emit);
    return s;
  });

  var vary = via(dedupe);

  function fromPromise(promise){
    var s = signal(), emit = slot(s);
    promise.done(emit);
    return s;
  }

  var foldp = curry(function(step, init, source){ //see Elm lang.
    var s = signal(), memo = init;
    source.on(function(value){
      memo = step(memo, value);
      relay(s, memo);
    });
    return s;
  });

  var delta = curry(function(f, source){ 
    var s = signal();
    source.on(function(){
      relay(s, f.apply(this, arguments));
    });
    return s;
  });

  function anyOf(values, source){
    return via(compose(map(contains(values)), dedupe), source);
  }

  function noneOf(values, source){
    return via(compose(map(complement(contains(values))), dedupe), source);
  }

  function translate(lkp, source){
    var s = signal();
    calc(fromPromise(promise(lkp).then(lookup)), source).on(function(lkp, value){
      lkp && relay(s, lkp(value));
    });
    return s;
  }

  var calc = function(){
    var values = new Array(arguments.length), s = signal(values), on = s.on;
    each(function(pair){
      var idx = pair[0], source = pair[1];
      source.on(function(value){
        values = slice(values);
        values[idx] = value;
        relay(s, values);
      });
      values[idx] = source.value;
    }, transduce(index(0), append, [], arguments));
    s.on = function(){
      on.apply(s, map(function(callback){
        return function(value, was){
          callback.apply(this, concat(value, was || []));
        }
      }, arguments));
    };
    return s;
  }

  //yields a function that accepts a single value onto a signal
  var slot = variadic(null, function(signal){
    return function(value){
      relay(signal, value);
    }
  }, function(xf, signal){
    xf = xf(relay);
    return function(value){
      xf(signal, value);
    }
  });

  //yields a function that accepts a sequence of values onto a signal
  var port = variadic(null, function(signal){
    return function(values){
      reduce(relay, signal, values);
    }
  }, function(xf, signal){
    xf = xf(relay);
    return function(values){
      reduce(xf, signal, values);
    }
  });

  function set(values){
    return new Set(values || []);
  }

  function unshift(){
    return reduce(prepend, last(arguments), chain(arguments, initial, reverse))
  }

  var into = variadic(null, null, function(to, from){
    return reduce(append, to, from);
  }, function(to, xform, from){
    return transduce(xform, append, to, from);
  });

  var seq = Seq.seq;

  function reduceLazySeq(xf, init, coll){
    var memo = init;
    while (coll && memo === init && !isReduced(memo)){ //`memo === init` forces stepping to run until the result is advanced (e.g. filtering does not always advance the result)
      memo = xf(memo, coll.head);
      coll = coll.tail();
    }
    var result = cons(memo.head, function(){
      return coll ? reduceLazySeq(xf, memo, coll) : undefined;
    });
    return coll ? result : xf(isReduced(result) ? result.deref() : result);
  }

  var sequence = variadic(null, seq, function(xform, coll){
    return reduceLazySeq(xform(append), cons(), seq(coll));
  }, function(xform){
    return sequence(xform, merge.apply(this, map(seq, rest(arguments))));
  });

  function toArray(xs){
    return isArray(xs) ? xs : into([], xs);
  }

  function iterate(generate, seed){
    return cons(seed, function(){
      return iterate(generate, generate(seed));
    });
  }

  var transduce = variadic(null, function(xform){
    return partial(transduce, xform);
  }, function(xform, coll){
    return transduce(xform, append, coll);
  }, function(xform, f, coll){
    return transduce(xform, f, f(), coll);
  }, function(xform, f, init, coll){
    return reduce(xform(f), init, coll);
  });

  function transducing(f){
    return curry(f.length + 1, function(){
      var args = initial(arguments), xs = last(arguments), xform = f.apply(this, args);
      return isFunction(xs) ? xform(xs) : transduce(xform, xs);
    });
  }

  function forward(f){
    return function(){
      return f.apply(this, arguments);
    }
  }

  function withStep(xf, step){
    var f = forward(xf);
    return reducer(f, f, step);
  }

  var repeatedly = variadic(null, function(f){
    return cons(f(), f);
  }, function(n, f){
    return n > 0 ? cons(f(), function(){
      return repeatedly(n - 1, f);
    }) : undefined;
  });

  var repeat = variadic(null, function(value){
    return repeatedly(constantly(value));
  }, function(n, value){
    return repeatedly(n, constantly(value))
  });

  var cycle = variadic(null, function(coll){
    var node = seq(coll);
    return cycle(node, node);
  }, function(coll, reset){
    return cons(coll.head, function(){
      return cycle(coll.tail() || reset, reset);
    });
  });

  var range = variadic(function(){
    return iterate(inc, 0);
  }, function(end){
    return range(0, end);
  }, function(start, end){
    return range(start, end, end > start ? 1 : -1);
  }, function(start, end, step){
    return cons(start, function(){
      if (start + step < end) //end is excluded
        return range(start + step, end, step);
    });
  });

  var tap = transducing(function(f){
    return function(xf){
      return withStep(xf, function(memo, value){
        f(value);
        return xf(memo, value);
      });
    }
  });

  var some = variadic(FALSE, function(pred){
    return reducer(FALSE, function(memo, value){
      var result = memo || pred(value);
      return result ? reduced(result) : result;
    });
  }, function(pred, xs){
    return reduce(some(pred), xs);
  });

  var every = variadic(TRUE, function(pred){
    return reducer(TRUE, function(memo, value){
      return memo && pred(value);
    });
  }, function(pred, xs){
    return reduce(every(pred), xs);
  });

  var annotate = transducing(function(f){
    return function(xf){
      return withStep(xf, function(memo, value){
        var annotation = f(value);
        return xf(memo, [annotation, value]);
      });
    }
  });

  var index = transducing(compose(annotate, counter));

  var group = variadic(null, null, function(seed, xf){
    return group(seed, xf, identity);
  }, function(seed, xf, f){
    f = mechanize(property, f);
    return reducer(function(){
      return {};
    }, function(memo, annotated){
      var annotation = annotated[0], value = annotated[1];
      memo[annotation] || (memo[annotation] = seed());
      memo[annotation] = xf(memo[annotation], f(value));
      return memo;
    });
  });

  var categorize = group(array, append);
  var tally      = group(constantly(0), add, constantly(1));

  var groupBy = curry(function(f, xs){
    return transduce(annotate(f), categorize, xs);
  });

  var takeNth = transducing(function(n){
    function at(idx){
      return idx % n == 0;
    }
    return function(xf){
      var idx = 0;
      return withStep(xf, function(memo, value){
        return at(idx++) ? xf(memo, value) : memo;
      });
    }
  });

  var partition = transducing(function(n){
    return function(xf){
      var remaining = n, out = xf(), fwd = forward(xf);
      return reducer(fwd, function(memo){
        return xf(out, memo);
      }, function(memo, value){
        if (remaining-- <= 0) {
          remaining = n - 1;
          out = xf(out, memo);
          return xf(xf(), value);
        } else {
          return xf(memo, value);
        }
      });
    }
  });

  var partitionBy = transducing(function(f){
    return function(xf){
      var last, initialized = false, out = xf(), fwd = forward(xf);
      return reducer(fwd, function(memo){
        return xf(out, memo);
      }, function(memo, value){
        var result, outcome = f(value);
        if (!initialized || outcome === last) {
          result = xf(memo, value);
        } else {
          out = xf(out, memo);
          result = xf(xf(), value);
        }
        initialized = true;
        last = outcome;
        return result;
      });
    }
  });

  var take = transducing(function(n){
    return function(xf){
      var remaining = n;
      return withStep(xf, function(memo, value){
        return remaining-- <= 0 ? reduced(memo) : xf(memo, value);
      });
    }
  });

  var drop = transducing(function(n){
    return function(xf){
      var remaining = n;
      return withStep(xf, function(memo, value){
        return remaining-- > 0 ? memo : xf(memo, value);
      });
    }
  });

  var takeWhile = transducing(function(pred){
    return function(xf){
      return withStep(xf, function(memo, value){
        return pred(value) ? xf(memo, value) : reduced(memo);
      });
    }
  });

  var skipWhile = transducing(function(pred){
    return function(xf){
      var taking = false;
      return withStep(xf, function(memo, value){
        pred(value) || (taking = true);
        return taking ? xf(memo, value) : memo;
      });
    }
  });

  var map = transducing(function(f){
    return function(xf){
      return withStep(xf, function(memo, value){
        return xf(memo, f(value));
      });
    }
  });

  var keep = transducing(function(f){
    return function(xf){
      return withStep(xf, function(memo, value){
        var result = f(value);
        return result !== undefined ? xf(memo, result) : memo;
      });
    }
  });

  var flattening = curry(function(isNested, xf){
    return function step(memo, value){
      return !isNested(value) ? xf(memo, value) : value.length === 0 ? memo : value.length === 1 ? step(memo, first(value)) : step(step(memo, first(value)), rest(value));
    }
  });

  var isNested = and(isIterable, function(obj){
    return obj && obj.hasOwnProperty('length');
  });
  var unnest = reducer(array, flattening(append, isNested));

  function flatten(){
    return transduce(flattening(isNested), append, [], slice(arguments));
  }

  function affix(obj, key, value){
    obj[key] = value;
    return obj;
  }

  function paired(f){
    return function(){
      var pair = last(arguments);
      var args = append(initial(arguments), pair[0], pair[1]);
      return f.apply(this, args);
    }
  }

  function reducekv(f, init, xs){
    return reduce(paired(f), init, xs);
  }

  function eachkv(f, init, xs){
    return each(paired(f), init, xs);
  }

  var filter = transducing(function(pred){
    return function(xf){
      return withStep(xf, function(memo, value){
        return pred(value) ? xf(memo, value) : memo;
      });
    }
  });

  var remove = transducing(function(pred){
    return filter(complement(pred));
  });

  var discriminate = transducing(function(pred, f){
    return function(xf){
      return withStep(xf, function(memo, value){
        return xf(memo, pred(value) ? f(value) : value);
      });
    }
  });

  var tee = transducing(function teeing(pred, sxf){
    return function(xf){
      return withStep(xf, function(memo, value){
        return (pred(value) ? sxf : xf)(memo, value);
      });
    }
  })

  function cat(xf){
    return function(memo, value){
      return reduce(xf, memo, value);
    }
  }

  var mapcat = transducing(function(f){
    return compose(mapping(f), cat);
  });

  var find = transducing(function(pred){
    return function(xf){
      return withStep(xf, function(memo, value){
        return pred(value) ? xf(reduced(value)) : undefined;
      });
    }
  });

  function dedupe(xf){
    var last;
    return withStep(xf, function(memo, value){
      var result = last === value ? memo : xf(memo, value);
      last = value;
      return result;
    });
  }

  function distinct(xf){
    var seen = set(); //type-agnostic cache
    return withStep(xf, function(memo, value){
      if (seen.has(value))
        return memo;
      seen.add(value);
      return xf(memo, value);
    });
  }

  var compact = partial(filter, identity);

  function pipe(){
    var fs = slice(arguments);
    return function(value){
      return reduce(chain, value, fs);
    }
  }

  function compose(){
    return pipe.apply(this, chain(arguments, slice, reverse));
  }

  function once(f){
    var o = function(){
      o = constantly(f.apply(this, arguments));
      return o();
    }
    return function(){
      return o.apply(this, arguments);
    }
  }

  function prefab(obj){
    return function(){
      var args = arguments;
      return reducekv(function(memo, key, value){
        memo[key] = isFunction(value) ? value.apply(this, args) : value;
        return memo;
      }, {}, obj);
    }
  }

  function memoize(f, hash) {
    hash || (hash = identity);
    var cache = {};
    return function(){
      var key = hash.apply(this, arguments);
      return cache.hasOwnProperty(key) ? cache[key] : (cache[key] = f.apply(this, arguments));
    }
  }

  function invoke(method){
    var args = rest(arguments);
    return function(obj){
      return obj[method].apply(obj, args);
    }
  }

  function invokeWith(){
    var applied = arguments;
    return function(f){
      return f.apply(this, concat(applied, rest(arguments)));
    }
  }

  function partial(f){
    var applied = rest(arguments);
    return function(){
      return f.apply(this, concat(applied, arguments));
    }
  }

  var optional = curry(2, function(f){
    var args = rest(arguments);
    return arguments.length > 0 && filter(identity, args).length === 0 ? undefined : f.apply(this, args);
  });

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  var times = curry(function(n, f){
    while (n > 0){
      f(n--);
    }
  });

  var doto = variadic(noop, identity, function(){
    var fs = arguments;
    return function(obj){
      each(bind(invokeWith.apply(obj, arguments), obj), fs);
      return obj;
    }
  });

  function flip(f){
    return curry(function(a, b){
      return f.apply(this, unshift(b, a, rest(arguments, 2)));
    });
  }

  var pick = curry(function(keys, obj){
    return transduce(filter(compose(contains(keys), property(0))), append, {}, obj);
  });

  var omit = curry(function(keys, obj){
    return transduce(remove(compose(contains(keys), property(0))), append, {}, obj);
  });

  var unresolved = find(isFunction);
  function resolving(f, maxDepth){
    maxDepth || (maxDepth = 100);
    function resolveWith(args, value){
      if (isFunction(value)) {
        return partial(resolveWith, map(function(arg){
          return isFunction(arg) ? compose(arg, value) : arg;
        }, args));
      } else {
        var depth = 0; //safeguard against infinite loop
        while(unresolved(args) && depth++ < maxDepth) {
          args = map(function(arg){
            return isFunction(arg) ? arg(value) : arg;
          }, args);
        }
        if (unresolved(args)) 
          throw "Unable to resolve";
        return f.apply(this, args);
      }
    }
    return function(){
      return unresolved(arguments) ? partial(resolveWith, arguments) : f.apply(this, arguments);
    }
  }

  var compare = curry(function(before, f, a, b){
    f = mechanize(property, f || identity);
    var fa = f(a), fb = f(b);
    return fa === fb ? 0 : before(fa, fb) ? 1 : -1;
  });

  var ascBy   = compare(gt),
      descBy  = compare(lt),
      asc     = ascBy(),
      desc    = descBy();
  var inc     = partial(add, +1);
  var dec     = partial(add, -1);

  return {
    add: add,
    affix: affix,
    all: every,
    alternate: alternate,
    always: constantly,
    and: and,
    annotate: annotate,
    any: some,
    anyOf: anyOf,
    append: append,
    Append: Append,
    applying: applying,
    arity: arity,
    asc: asc,
    ascBy: ascBy,
    best: best,
    binary: binary,
    bind: bind,
    calc: calc,
    cat: cat,
    categorize: categorize,
    chain: chain,
    compact: compact,
    compare: compare,
    complement: complement,
    compose: compose,
    concat: concat,
    conj: append,
    cons: cons,
    constantly: constantly,
    contains: contains,
    curry: curry,
    cycle: cycle,
    dec: dec,
    dedupe: dedupe,
    delta: delta,
    desc: desc,
    descBy: descBy,
    detect: find,
    discriminate: discriminate,
    distinct: distinct,
    dot: property,
    doto: doto,
    drop: drop,
    each: each,
    eachkv: eachkv,
    eq: eq,
    even: even,
    every: every,
    extend: extend,
    FALSE: FALSE,
    filter: filter,
    find: find,
    first: first,
    flatten: flatten,
    flattening: flattening,
    flip: flip,
    foldp: foldp,
    group: group,
    groupBy: groupBy,
    gt: gt,
    gte: gte,
    guid: guid,
    identity: identity,
    inc: inc,
    index: index,
    indexBy: indexBy,
    initial: initial,
    into: into,
    invoke: invoke,
    invokeWith: invokeWith,
    isArguments: isArguments,
    isArray: isArray,
    isFunction: isFunction,
    isIterable: isIterable,
    isNumber: isNumber,
    isObject: isObject,
    isReduced: isReduced,
    isString: isString,
    isType: isType,
    iterate: iterate,
    keep: keep,
    last: last,
    lookup: lookup,
    lt: lt,
    lte: lte,
    map: map,
    mapcat: mapcat,
    matches: matches,
    max: max,
    mechanize: mechanize,
    memoize: memoize,
    merge: merge,
    min: min,
    multimethod: multimethod,
    ne: ne,
    noneOf: noneOf,
    noop: noop,
    not: not,
    odd: odd,
    omit: omit,
    once: once,
    optional: optional,
    or: or,
    paired: paired,
    partial: partial,
    partition: partition,
    partitionBy: partitionBy,
    pick: pick,
    pipe: pipe,
    port: port,    
    prefab: prefab,
    prepend: prepend,
    property: property,
    protocol: protocol,
    push: append,
    range: range,
    realize: realize,
    reduce: reduce,
    Reduce: Reduce,
    reducekv: reducekv,
    reducer: reducer,
    reject: remove,
    relay: relay,
    remove: remove,
    repeat: repeat,
    repeatedly: repeatedly,
    rest: rest,
    resolving: resolving,
    reverse: reverse,
    select: filter,
    selected: selected,
    seq: seq,
    sequence: sequence,
    set: set,
    signal: signal,
    skipWhile: skipWhile,
    slice: slice,
    slot: slot,    
    some: some,
    str: str,
    subtract: subtract,
    take: take,
    takeNth: takeNth,
    takeWhile: takeWhile,
    tally: tally,
    tap: tap,
    tee: tee,
    times: times,
    toArray: toArray,
    toBool: toBool,    
    transduce: transduce,
    translate: translate,
    TRUE: TRUE,
    unary: unary,
    unbind: unbind,
    union: union,
    unique: distinct,
    unnest: unnest,
    unshift: unshift,
    value: value,
    variadic: variadic,
    vary: vary,
    via: via
  }
})();
