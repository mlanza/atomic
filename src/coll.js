import {complement, identity, isSome, overload, constantly, partial, add, is, slice, pipe, arity, unspread, juxt, key} from './core';
import {satisfies} from './protocol';
import {seq} from './protocols/seqable';
import {first, rest} from './protocols/seq';
import Collection from './protocols/collection';
import Emptyable from './protocols/emptyable';
import Next from './protocols/next';
import Lookup from './protocols/lookup';
import {count} from './protocols/counted';
import Associative from './protocols/associative';
import Comparable from './protocols/comparable';
import Reversible from './protocols/reversible';
import {reduce} from './protocols/reduce';
import Reduced from './types/reduced';
import List from './types/list';
import LazyList from './types/lazy-list';
import {EMPTY} from './types/empty';

function _cons(head, tail){
  return new List(head, tail);
}

function _consN(){
  var tail = arguments[arguments.length - 1],
      item = arguments[arguments.length - 2],
      init = slice(arguments, 0, arguments.length - 2),
      memo = _cons(item, tail);
  return  cons.apply(this, init.concat([memo]));
}

export const cons = overload(null, null, _cons, _consN);

function _partition(n, xs){
  return partitionStep(n, n, xs);
}

function _partitionStep(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, _partitionStep(n, step, drop(step, coll))) : EMPTY;
}

function _partitionStepPad(n, step, pad, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, _partitionStepPad(n, step, pad, drop(step, coll))) : new List(take(n, concat(part, pad)));
}

function _partitionAll(n, xs){
  return _partitionAllStep(n, n, xs);
}

function _partitionAllStep(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  return cons(take(n, coll), _partitionStep(n, step, drop(step, coll)));
}

function _partitionBy(f, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const fst = first(coll),
        val = f(fst),
        run = cons(fst, takeWhile(function(x){
          return val === f(x);
        }, Next.next(coll)));
  return cons(run, _partitionBy(f, seq(drop(count(run), coll))));
}

export const partition = overload(null, null, _partition, _partitionStep, _partitionStepPad);
export const partitionBy = overload(null, null, _partitionBy); //TODO transducer
export const partitionAll = overload(null, null, _partitionAll, _partitionAllStep); //TODO transducer

function _assoc(obj, ...kvs){
  return reduce(partition(2, kvs), function(memo, pair){
    return Associative.assoc(memo, pair[0], pair[1]);
  }, obj);
}

export const assoc = overload(null, null, null, Associative.assoc, _assoc);

function _dissoc(obj, ...keys){
  return reduce(keys, function(memo, key){
    return Associative.dissoc(memo, key);
  }, obj);
}

export const dissoc = overload(null, null, Associative.dissoc, _assoc);

export function groupBy(f, coll){
  return reduce(coll, function(memo, value){
    var key = f(value), group = null;
    if (memo.has(key)) {
      group = memo.get(key);
    } else {
      group = [];
      memo.set(key, group);
    }
    group.push(value);
    return memo;
  }, new Map());
}

export function update(obj, key, f, ...args){
  const value = Lookup.get(obj, key);
  return Associative.assoc(obj, key, f.apply(this, [value].concat(args)));
}

export function updateIn(obj, path, f, ...args){
  return path.length > 1 ? update.apply(this, [obj, path[0], updateIn, slice(path, 1), f].concat(args)) : update.apply(this, [obj, path[0], f].concat(args));
}

export function getIn(obj, path){
  return reduce(path, function(memo, key){
    const found = Lookup.get(memo, key);
    return found == null ? new Reduced(null) : found;
  }, obj);
}

export const second = pipe(rest, first);

export function coll(value){
  return value == null ? [] : satisfies(Seqable, value) ? value : [value];
}

export function last(xs){
  return reduce(xs, function(memo, x){
    return x;
  }, null);
}

export function dotimes(n, f){
  for(var i = 0; i < n; i++) {
    f(i);
  }
}

export const doall = overload(null, function(xs){
  var coll = xs;
  while(coll = seq(coll)){
    first(coll);
    coll = rest(coll);
  }
}, function(n, xs){
  var coll = xs;
  while((coll = seq(coll)) && n > 0) {
    first(coll);
    coll = rest(coll);
    n--;
  }
});

export const str = overload(constantly(""), function(obj){
  return obj == null ? "" : obj.toString();
}, function(){
  return into("", map(str, arguments));
});

export function butlast(xs){
  return dropLast(1, xs);
}

export const dropLast = overload(null, butlast, function(n, xs){
  return map(identity, xs, drop(n, xs));
});

export function takeLast(n, xs){
  var coll = seq(xs),
      lead = seq(drop(n, xs));
  while (true){
    if (lead){
      coll = next(coll);
      lead = next(lead);
    } else {
      return coll;
    }
  }
}

export const splitAt = juxt(take, drop);
export const splitWith = juxt(takeWhile, dropWhile);

export function compare(x, y){
  if (x === y)   return 0;
  if (x == null) return -1;
  if (y == null) return -1;
  return Comparable.compare(x, y);
}

function _sortWith(compare, xs){
  var arr = is(Array, xs) ? slice(xs) : toArray(xs);
  arr.sort(compare);
  return arr;
}

function _sort(xs){
  return _sortWith(compare, xs);
}

function _sortBy(f, xs){
  return _sortByWith(f, compare, xs);
}

function _sortByWith(f, compare, xs){
  return _sortWith(function(x, y){
    return compare(f(x), f(y));
  }, xs);
}

export const sort = overload(null, _sort, _sortWith);
export const sortBy = overload(null, null, _sortBy, _sortByWith);

export function interpose(sep, xs){
  const coll = seq(xs),
        fst  = first(coll);
  if (!coll) return EMPTY;
  const nxt = Next.next(coll);
  return nxt ? new LazyList(fst, function(){
    return nxt ? new LazyList(sep, function(){
      return interpose(sep, nxt);
    }) : EMPTY;
  }) : new List(fst);
}

function _interleave(){
  if (arguments.length < 2) return EMPTY;
  const coll   = map(seq, arguments),
        firsts = map(first, coll),
        nexts  = map(Next.next, coll);
  return isEvery(isSome, firsts) ? nexts ? new LazyList(firsts, function(){
    return _interleave.apply(this, toArray(nexts));
  }) : new List(firsts) : EMPTY;
}

export function interleave(){
  return cat(_interleave.apply(this, arguments));
}

export function iterator(xs){
  var coll = seq(xs);
  return {
    next: function(){
      var resp = {value: first(coll), done: !coll};
      coll = Next.next(coll);
      return resp;
    }
  }
}

export function each(f, xs){
  var coll = xs;
  while(coll = seq(coll)){
    f(first(coll));
    coll = rest(coll);
  }
}

function _map(f, xs){
  var coll = seq(xs);
  return coll ? new LazyList(f(first(coll)), function(){
    return _map(f, rest(coll));
  }) : EMPTY;
}

function _mapN(f, ...colls){
  return isEvery(seq, colls) ? new LazyList(f.apply(this, toArray(_map(first, colls))), function(){
    return map.apply(this, [f].concat(toArray(_map(rest, colls))));
  }) : EMPTY;
}

export const map = overload(null, null, _map, _mapN);

export function mapIndexed(f, xs){
  var idx = -1;
  return map(function(x){
    return f(++idx, x);
  }, xs);
}

export function keep(f, xs){
  return filter(isSome, map(f, xs));
}

export function take(n, xs){
  return n > 0 && seq(xs) ? new LazyList(first(xs), function(){
    return take(n - 1, rest(xs));
  }) : EMPTY;
}

export function takeWhile(pred, xs){
  if (!seq(xs)) return EMPTY;
  const item = first(xs);
  return pred(item) ? new LazyList(item, function(){
    return takeWhile(pred, rest(xs));
  }) : EMPTY;
}

export function takeNth(n, xs){
  return seq(xs) ? new LazyList(first(xs), function(){
    return takeNth(n, drop(n, xs));
  }) : EMPTY;
}

export function drop(n, xs){
  var remaining = n;
  return dropWhile(function(){
    return remaining-- > 0;
  }, xs);
}

export function dropWhile(pred, xs){
  return seq(xs) ? pred(first(xs)) ? dropWhile(pred, rest(xs)) : xs : EMPTY;
}

export function some(pred, xs){
  const coll = seq(xs);
  if (!coll) return null;
  const fst = first(coll);
  return pred(fst) ? fst : some(pred, rest(coll));
}

export function someFn(){
  const fs = arguments;
  return function(){
    return arguments.length ? !!some(function(x){
      return some(function(f){
        return f(x);
      }, fs) ? x : null;
    }, arguments) : null;
  }
}

export function everyPred(){
  const preds = arguments;
  return function(){
    return arguments.length ? isEvery(function(x){
      return isEvery(function(pred){
        return pred(x);
      }, preds);
    }, arguments) : true;
  }
}

export function keys(xs){
  const coll = seq(xs);
  return coll ? map(key, coll) : EMPTY;
}

export function scan(pred, xs){
  if (!seq(xs)) return true;
  const fst  = first(xs),
        rst  = rest(xs),
        coll = seq(rst);
  return coll ? pred(fst, first(coll)) && scan(pred, rst) : true;
}

export const eq = overload(constantly(true), constantly(true), function(...xs){
  return scan(function(x, y){
    return x == y;
  }, xs);
});

export const ne = overload(constantly(false), constantly(false), function(...xs){
  return scan(function(x, y){
    return x != y;
  }, xs);
});

export const gt = overload(constantly(false), constantly(true), function(...xs){
  return scan(function(x, y){
    return x > y;
  }, xs);
});

export const gte = overload(constantly(true), constantly(true), function(...xs){
  return scan(function(x, y){
    return x >= y;
  }, xs);
});

export const lt = overload(constantly(false), constantly(true), function(...xs){
  return scan(function(x, y){
    return x < y;
  }, xs);
});

export const lte = overload(constantly(true), constantly(true), function(...xs){
  return scan(function(x, y){
    return x <= y;
  }, xs);
});

export function indescriminate(x, ...xs){
  if (!xs.length) return x;
  return x ? indescriminate.apply(this, xs) : x;
}

export function coalesce(x, ...xs){
  return x ? x : coalesce.apply(this, xs);
}

export const or  = overload(constantly(null), identity, coalesce);
export const and = overload(constantly(true), identity, indescriminate);

export function isEvery(pred, xs){
  if (!seq(xs)) return true;
  return pred(first(xs)) && isEvery(pred, rest(xs));
}

export function isNotEvery(pred, xs){
  return isEvery(complement(pred), xs);
}

export function isAny(pred, xs){
  return some(pred, xs) !== null;
}

export function isNotAny(pred, xs){
  return isAny(complement(pred), xs);
}

export function fold(f, init, xs){
  return init instanceof Reduced ? init.valueOf() : seq(xs) ? fold(f, f(init, first(xs)), rest(xs)) : init instanceof Reduced ? init.valueOf() : init;
}

export function filter(pred, xs){
  var coll = seq(xs);
  if (!coll) return EMPTY;
  var fst = first(coll);
  return pred(fst) ? new LazyList(fst, function(){
    return filter(pred, rest(coll));
  }) : filter(pred, rest(coll));
}

export function remove(pred, xs){
  return filter(complement(pred), xs);
}

export function compact(xs){
  return filter(identity, xs);
}

export function find(pred, xs){
  return first(filter(pred, xs));
}

export function flatten(xs){
  if (!seq(xs)) return EMPTY;
  var fst = first(xs),
      rst = rest(xs);
  return satisfies(Seqable, fst) ? flatten(concat(fst, rst)) : new LazyList(fst, function(){
    return flatten(rst);
  });
}

export function reverse(xs){
  return is(Reversible, xs) ? rseq(xs) : reduce(xs, Collection.conj, EMPTY);
}

export function cat(xs){
  const ys = seq(xs);
  const coll = seq(compact(map(seq, ys)));
  if (!coll) return EMPTY;
  const fst = first(coll);
  return new LazyList(first(fst), function(){
    const rst = rest(coll);
    return seq(fst) ? cat([rest(fst)].concat(toArray(rst))) : cat(rst);
  });
}

export function concat(){
  return cat(arguments);
}

export function mapcat(f, xs){
  return cat(map(f, xs));
}

export function best(pred, xs){
  const coll = seq(xs);
  return coll ? reduce(rest(coll), function(a, b){
    return pred(a, b) ? a : b;
  }, first(coll)) : null;
}

export function max(){
  return best(gt, arguments);
}

export function min(){
  return best(lt, arguments);
}

export function toArray(xs){
  if (xs instanceof Array) return xs;
  return seq(xs) ? into([], xs) : [];
}

export function toObject(obj){
  if (obj == null) return {};
  if (obj.constructor === Object) return obj;
  var coll = seq(obj);
  if (!coll) return {};
  return reduce(coll, Collection.conj, {});
}

export function iterate(generate, seed){
  return new LazyList(seed, function(){
    return iterate(generate, generate(seed));
  });
}

export const repeatedly = overload(null, function(f){
  return iterate(f, f());
}, function(n, f){
  return n > 0 ? new LazyList(f(), function(){
    return repeatedly(n - 1, f);
  }) : EMPTY;
});

export const repeat = overload(null, function(value){
  return repeatedly(constantly(value));
}, function(n, value){
  return repeatedly(n, constantly(value))
});

function _cycle(xs, ys){
  if (arguments.length === 1) return _cycle(xs, xs);
  var coll = seq(xs) || seq(ys);
  return coll ? new LazyList(first(coll), function(){
    return _cycle(rest(coll), ys);
  }) : EMPTY;
}

export const cycle = arity(1, _cycle);

function _dedupe(xs, x){
  const coll = seq(xs),
        fst  = first(coll);
  return coll ? fst === x ?  _dedupe(rest(coll), fst) : new LazyList(fst, function(){
    return _dedupe(rest(coll), fst);
  }) : EMPTY;
}

export const dedupe = arity(1, _dedupe);

export function distinct(xs){
  var coll = seq(xs);
  return coll ? toArray(new Set(coll)) : EMPTY;
}

export const range = overload(function(){ //TODO number range, date range, string range, etc.
  return iterate(inc, 0);
}, function(end){
  return range(0, end);
}, function(start, end){
  return range(start, end, 1);
}, function(start, end, step){
  return start < end ? new LazyList(start, function(){
    return range(start + step, end, step);
  }) : EMPTY;
});

export function seeding(f, init){
  return overload(init, identity, f);
}

export const transduce = overload(null, null, null, function(xform, f, coll){
  var xf = xform(f);
  return xf(reduce(coll, xf, f()));
}, function(xform, f, seed, coll){
  return transduce(xform, seeding(f, constantly(seed)), coll);
});

export const into = overload(null, null, function(to, from){
  return reduce(from, Collection.conj, to);
}, function(to, xform, from){
  return transduce(xform, Collection.conj, to, from);
});

export function transform(xform, coll){
  return into(Emptyable.empty(coll), xform, coll);
}

export function expansive(f){
  var isFn = partial(is, Function);
  function expand(args, value){
    if (isFn(value)){
      return pipe(value, partial(expand, args));
    }
    while(some(isFn, args)){
      args = map(function(arg){
        return isFn(arg) ? arg(value) : arg;
      }, args)
    }
    return f.apply(this, toArray(args));
  }
  return function(){
    var args = slice(arguments);
    return some(isFn, args) ? partial(expand, args) : f.apply(this, args);
  }
}