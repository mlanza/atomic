import {overload, partial, curry, called, toggles, identity, obj, partly, comp, doto, does, branch, unspread, applying, execute, noop, constantly, once, isFunction, isString} from "./core.js";
import {IAssociative, IClonable, IHierarchy, ILookup, ISeq} from "./protocols.js";
import {just, satisfies, spread, maybe, each, duration, remove, sort, flip, realized, apply, realize, isNil, reFindAll, mapkv, period, selectKeys, mapVals, reMatches, test, date, emptyList, cons, days, recurrence, second as _second, Nil} from "./types.js";
import {isBlank, str, replace} from "./types/string.js";
import {isSome} from "./types/nil.js";
import {implement, behaves} from "./types/protocol/concrete.js";
import {into, detect, map, mapa, splice, drop, join, some, last, takeWhile, dropWhile, filter, lazySeq} from "./types/lazy-seq.js";
import {concat} from "./types/concatenated.js";
import iseries from "./types/series/behave.js";
export {filter} from "./types/lazy-seq.js";
export const serieslike = iseries;
export {iterable} from "./types/lazy-seq/behave.js";
export * from "./core.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
import * as p from "./protocols/concrete.js";
import Set from "set";
import {extend} from "./types/protocol/concrete.js";
import {Protocol} from "./types/protocol/construct.js";
import iprotocol from "./types/protocol/behave.js";
iprotocol(Protocol);

import {behaviors} from "./behaviors.js";
export * from "./behaviors.js";
export const behave = behaves(behaviors, ?);

export const yank = called(p.omit, "`yank` is deprecated — use `omit` instead.");
export const numeric = test(/^\d+$/i, ?);

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

function forward1(key){
  return function forward(f){
    return function(self, ...args){
      return f.apply(this, [self[key], ...args]);
    }
  }
}

function forwardN(target, ...protocols){
  const fwd = forward1(target);
  const behavior = mapa(function(protocol){
    return implement(protocol, p.reduce(function(memo, key){
      return p.assoc(memo, key, fwd(protocol[key]));
    }, {}, p.keys(protocol)));
  }, protocols);
  return does(...behavior);
}

export const forward = overload(null, forward1, forwardN);
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
  return p.toArray(new Set(p.toArray(xs)));
}

export const second = branch(satisfies(ISeq, ?), p.second, _second);

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
  const fn    = isFunction(f),
        named = fn ? p.name(f) : null,
        type = typeof named;
  return fn && type !== "symbol" && !/^[A-Z]./.test(named);
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

export function coalesce(...fs){
  return function(...args){
    return detect(isSome, map(applying(...args), fs));
  }
}

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
