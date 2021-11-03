import {overload, partial, unary, type, curry, tee, toggles, identity, obj, partly, comp, doto, does, branch, unspread, applying, execute, noop, constantly, once, isFunction, isString} from "./core.js";
import {ICoercible, IForkable, ILogger, IDeref, IFn, IAssociative, IClonable, IHierarchy, ILookup, ISeq} from "./protocols.js";
import {just, satisfies, spread, maybe, opt, each, duration, remove, sort, flip, realized, apply, realize, isNil, reFindAll, mapkv, period, selectKeys, mapVals, reMatches, test, date, emptyList, cons, days, recurrence, emptyArray} from "./types.js";
import {isBlank, str, replace} from "./types/string.js";
import {isSome} from "./types/nil.js";
import _config from "./config.js";
import {implement, specify, behaves} from "./types/protocol/concrete.js";
import {into, detect, map, mapa, splice, drop, join, some, last, takeWhile, dropWhile, filter} from "./types/lazy-seq.js";
import {concat} from "./types/concatenated.js";
export const config = _config;
export {filter} from "./types/lazy-seq.js";
export {iterable} from "./types/lazy-seq/behave.js";
export * from "./core.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
import * as p from "./protocols/concrete.js";
import * as T from "./types.js";
import Set from "set";
import {extend, forward} from "./types/protocol/concrete.js";
import {Protocol} from "./types/protocol/construct.js";
import iprotocol from "./types/protocol/behave.js";
iprotocol(Protocol);

import {behaviors} from "./behaviors.js";
export * from "./behaviors.js";
export const behave = behaves(behaviors, ?);

function called4(fn, message, context, logger){
  return function(){
    const meta = Object.assign({}, context, {fn, arguments});
    p.log(logger, message, meta);
    return meta.results = fn.apply(this, arguments);
  }
}

function called3(fn, message, context){
  return called4(fn, message, context, config.logger);
}

function called2(fn, message){
  return called3(fn, message, {});
}

export const called = overload(null, null, called2, called3, called4);

function addProp(obj, key, value){
  if (obj.hasOwnProperty(key)) {
    throw new Error("Property `" + key + "` already defined on " + obj.constructor.name + ".");
  } else {
    Object.defineProperty(obj, key, {
      value,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
}

function equals(other){
  return p.equiv(this, other);
}

addProp(Object.prototype, "equals", equals);

export const yank = called(p.omit, "`yank` is deprecated — use `omit` instead.");
export const numeric = test(/^\d+$/i, ?);

(function(){

  function log(self, ...args){
    self.log(...args);
  }

  doto(console,
    specify(ILogger, {log}));

  doto(T.Nil,
    implement(ILogger, {log: noop}));

})();

export function severityLogger(logger, severity){
  const f = logger[severity].bind(logger);
  function log(self, ...args){
    f(...args);
  }
  return doto({logger, severity},
    specify(ILogger, {log}));
}

export function metaLogger(logger, ...meta){
  function log(self, ...args){
    p.log(logger, ...[...mapa(execute, meta), ...args]);
  }
  return doto({logger, meta},
    specify(ILogger, {log}));
}

export function labelLogger(logger, ...labels){
  function log(self, ...args){
    p.log(logger, ...[...labels, ...args]);
  }
  return doto({logger, labels},
    specify(ILogger, {log}));
}

export function peek(logger){
  return tee(p.log(logger, ?));
}

function siblings(self){
  const parent = p.parent(self);
  if (parent){
    return filter(function(sibling){
      return sibling !== self;
    }, p.children(parent));
  } else {
    return emptyList();
  }
}

function prevSiblings(self){
  return reverse(takeWhile(function(sibling){
    return sibling !== self;
  }, siblings(self)));
}

function nextSiblings(self){
  return p.rest(dropWhile(function(sibling){
    return sibling !== self;
  }, siblings(self)));
}

const prevSibling = comp(p.first, p.prevSiblings);
const nextSibling = comp(p.first, p.nextSiblings);
const parents = p.upward(p.parent);
const descendants = p.downward(p.children);
const root = comp(last, parents);

function closest(self, pred){
  return detect(pred, cons(self, p.parents(self)));
}

extend(IHierarchy, {siblings, prevSibling, nextSibling, prevSiblings, nextSiblings, parents, closest, root});

export const forwardTo = called(forward, "`forwardTo` is deprecated — use `forward` instead.");

function recurs2(pd, step) {
  return recurrence(p.start(pd), p.end(pd), step);
}

export const recurs = overload(null, recurs2(?, days(1)), recurs2);

export function inclusive(self){
  return new self.constructor(self.start, p.add(self.end, self.step), self.step, self.direction);
}

function cleanlyN(f, ...args){
  try {
    return f(...args);
  } catch {
    return null;
  }
}

export const cleanly = overload(null, curry(cleanlyN, 2), cleanlyN);

function mod3(obj, key, f){
  if (key in obj) {
    obj[key] = f(obj[key]); //must be a mutable copy
  }
  return obj;
}

function modN(obj, key, value, ...args){
  return args.length > 0 ? modN(mod3(obj, key, value), ...args) : mod3(obj, key, value);
}

const mod = overload(null, null, null, mod3, modN);

//Has the api of `assoc` and behaves like `update` persistently updating object attributes.  Depends on `clone` but not `lookup` or `assoc`.
export function edit(obj, ...args){
  const copy = p.clone(obj);
  args.unshift(copy);
  return modN.apply(copy, args);
}

export function deconstruct(dur, ...units){
  let memo = dur;
  return mapa(function(unit){
    const n = p.fmap(p.divide(memo, unit), Math.floor);
    memo = p.subtract(memo, p.fmap(unit, constantly(n)));
    return n;
  }, units);
}

export function toQueryString(obj){
  return just(obj, mapkv(str(?, "=", ?), ?), join("&", ?), collapse("?", ?));
}

export function fromQueryString(url){
  const params = {};
  each(function (match) {
    const key = decodeURIComponent(match[1]), val = decodeURIComponent(match[2]);
    params[key] = val;
  }, reFindAll(/[?&]([^=&]*)=([^=&]*)/g, url));
  return params;
}

export function unique(xs){
  return p.coerce(new Set(p.coerce(xs, Array)), Array);
}

export const second = branch(satisfies(ISeq, ?), comp(ISeq.first, ISeq.rest), p.prop("second"));

export function expands(f){
  function expand(...contents){
    return detect(isFunction, contents) ? postpone(...contents) : f(...contents);
  }
  function postpone(...contents){
    return function(value){
      const expanded = map(function(content){
        return isFunction(content) ? content(value) : content;
      }, contents);
      return apply(expand, expanded);
    }
  }
  return expand;
}

export function xarg(fn, n, f){
  return function(){
    arguments[n] = f(arguments[n]);
    return fn.apply(this, arguments);
  }
}

export function xargs(f, ...fs){
  return function(...args){
    return apply(f, map(execute, fs, args));
  }
}

function filled2(f, g){
  return function(...args){
    return p.seq(filter(isNil, args)) ? g(...args) : f(...args);
  }
}

function filled1(f){
  return filled2(f, noop);
}

export const filled = overload(null, filled1, filled2);

export function elapsed(self){
  return duration(p.end(self) - p.start(self));
}

export function collapse(...args){
  return some(isBlank, args) ? "" : join("", args);
}

function impartable(f){
  return isFunction(f) && !/^[A-Z]./.test(p.name(f));
}

//convenience for wrapping batches of functions.
export function impart(self, f){ //override `impart` with `identity` to nullify its effects
  return p.reducekv(function(memo, key, value){
    return p.assoc(memo, key, impartable(value) ? f(value) : value); //impart to functions which are not also constructors
  }, {}, self);
}

function include2(self, value){
  return toggles(p.conj(?, value), p.omit(?, value), p.includes(?, value), self);
}

function include3(self, value, want){
  return toggles(p.conj(?, value), p.omit(?, value), p.includes(?, value), self, want);
}

export const include = overload(null, null, include2, include3);

export const fmt = expands(str);

export function when(pred, ...xs) {
  return last(map(realize, pred ? xs : null));
}

export function readable(keys){
  const lookup = keys ? function(self, key){
    if (!p.includes(keys, key)) {
      throw new Error("Cannot read from " + key);
    }
    return self[key];
  } : function(self, key){
    return self[key];
  }
  return implement(ILookup, {lookup});
}

export function writable(keys){
  function clone(self){
    return Object.assign(Object.create(self.constructor.prototype), self);
  }
  function contains(self, key){
    return self.hasOwnProperty(key);
  }
  const assoc = keys ? function(self, key, value){
    if (!p.includes(keys, key) || !contains(self, key)) {
      throw new Error("Cannot write to " + key);
    }
    var tgt = clone(self);
    tgt[key] = value;
    return tgt;
  } : function(self, key, value){
    if (!contains(self, key)) {
      throw new Error("Cannot write to " + key);
    }
    var tgt = clone(self);
    tgt[key] = value;
    return tgt;
  }
  return does(
    implement(IClonable, {clone}),
    implement(IAssociative, {assoc, contains}));
}


function scanKey1(better){
  return partial(scanKey, better);
}

function scanKey3(better, k, x){
  return x;
}

function scanKey4(better, k, x, y){
  return better(k(x), k(y)) ? x : y;
}

function scanKeyN(better, k, x, ...args){
  return apply(p.reduce, partial(scanKey3, better), x, args);
}

export const scanKey = overload(null, scanKey1, null, scanKey3, scanKey4, scanKeyN);
export const maxKey  = scanKey(p.gt);
export const minKey  = scanKey(p.lt);

function absorb2(tgt, src){
  return p.reducekv(function(memo, key, value){
    const was = p.get(memo, key);
    let absorbed;
    if (was == null) {
      absorbed = value;
    } else if (descriptive(value)) {
      absorbed = into(p.empty(was), absorb(was, value));
    } else if (satisfies(ISequential, value)) {
      absorbed = into(p.empty(was), concat(was, value));
    } else {
      absorbed = value;
    }
    return p.assoc(memo, key, absorbed);
  }, tgt, src || p.empty(tgt));
}

export const absorb = overload(constantly({}), identity, absorb2, p.reducing(absorb2));

export function unfork(self){
  return new Promise(function(resolve, reject){
    p.fork(self, reject, resolve);
  });
}

function reduceToArray(self){
  return p.reduce(function(memo, value){
    memo.push(value);
    return memo;
  }, [], self);
}

ICoercible.addMethod([Number, String], unary(str));
ICoercible.addMethod([Number, Date], unary(date));
ICoercible.addMethod([T.Duration, T.Duration], identity);
ICoercible.addMethod([T.Period, T.Duration], function(self){
  return self.end == null || self.start == null ? duration(Number.POSITIVE_INFINITY) : duration(self.end - self.start);
});
ICoercible.addMethod([Promise, Promise], identity);
ICoercible.addMethod([T.Right, Promise], unfork);
ICoercible.addMethod([T.Left, Promise], unfork);
ICoercible.addMethod([Error, Promise], unfork);
ICoercible.addMethod([T.Maybe, Promise], unfork);
ICoercible.addMethod([T.Okay, Promise], unfork);
ICoercible.addMethod([T.Task, Promise], unfork);
ICoercible.addMethod([Object, Object], identity);
ICoercible.addMethod([Array, Object], function(self){
  return p.reduce(function(memo, [key, value]){
    memo[key] = value;
    return memo;
  }, {}, self);
});
ICoercible.addMethod([Array, Array], identity);
ICoercible.addMethod([T.Multimap, Array], comp(Array.from, p.seq));
ICoercible.addMethod([T.Concatenated, Array], reduceToArray);
ICoercible.addMethod([T.EmptyList, Array], emptyArray);
ICoercible.addMethod([T.List, Array], reduceToArray);
ICoercible.addMethod([T.Range, Array], reduceToArray);
ICoercible.addMethod([T.Nil, Array], emptyArray);
ICoercible.addMethod([T.IndexedSeq, Array], reduceToArray);
ICoercible.addMethod([T.RevSeq, Array], Array.from);
ICoercible.addMethod([T.LazySeq, Array], function(xs){
  let ys = xs;
  const zs = [];
  while (p.seq(ys) != null) {
    zs.push(p.first(ys));
    ys = p.rest(ys);
  }
  return zs;
});
ICoercible.addMethod([T.Multimap, Array], comp(Array.from, p.seq));
ICoercible.addMethod([Object, Array], reduceToArray);
ICoercible.addMethod([String, Array], function(self){
  return self.split("");
});
