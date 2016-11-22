import {complement, identity, isSome, multiarity, overload, constantly, partial, add, is, slice, pipe, arity} from './core';
import {satisfies} from './protocol';
import Seqable from './protocols/seqable';
import Seq from './protocols/seq';
import Collection from './protocols/collection';
import Emptyable from './protocols/emptyable';
import Next from './protocols/next';
import Reduce from './protocols/reduce';
import Reduced from './types/reduced';
import List from './types/list';
import LazyList from './types/lazy-list';
import {EMPTY} from './types/empty';

export function iterator(xs){
  var coll = Seqable.seq(xs);
  return {
    next: function(){
      var resp = {value: Seq.first(coll), done: !coll};
      coll = Next.next(coll);
      return resp;
    }
  }
}

export function each(f, xs){
  var coll = xs;
  while(coll = Seqable.seq(coll)){
    f(Seq.first(coll));
    coll = Seq.rest(coll);
  }
}

export function map(f, xs){
  var coll = Seqable.seq(xs);
  if (!coll) return EMPTY;
  return new LazyList(f(Seq.first(coll)), function(){
    return map(f, Seq.rest(coll));
  });
}

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
  return n > 0 && Seqable.seq(xs) ? new LazyList(Seq.first(xs), function(){
    return take(n - 1, Seq.rest(xs));
  }) : EMPTY;
}

export function takeWhile(pred, xs){
  if (!Seqable.seq(xs)) return EMPTY;
  var item = Seq.first(xs);
  return pred(item) ? new LazyList(item, function(){
    return takeWhile(pred, Seq.rest(xs));
  }) : EMPTY;
}

export function takeNth(n, xs){
  return Seqable.seq(xs) ? new LazyList(Seq.first(xs), function(){
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
  return Seqable.seq(xs) ? pred(Seq.first(xs)) ? dropWhile(pred, Seq.rest(xs)) : xs : EMPTY;
}

export function some(pred, xs){
  if (!Seqable.seq(xs)) return null;
  var fst = Seq.first(xs);
  return pred(fst) ? fst : some(pred, Seq.rest(xs));
}

export function isEvery(pred, xs){
  if (!Seqable.seq(xs)) return true;
  return pred(Seq.first(xs)) && isEvery(pred, Seq.rest(xs));
}

export function isAny(pred, xs){
  return some(pred, xs) !== null;
}

export function fold(f, init, xs){
  return init instanceof Reduced ? init.valueOf() : Seqable.seq(xs) ? fold(f, f(init, Seq.first(xs)), Seq.rest(xs)) : init instanceof Reduced ? init.valueOf() : init;
}

export function filter(pred, xs){
  var coll = Seqable.seq(xs);
  if (!coll) return EMPTY;
  var fst = Seq.first(coll);
  return pred(fst) ? new LazyList(fst, function(){
    return filter(pred, Seq.rest(coll));
  }) : filter(pred, Seq.rest(coll));
}

export function remove(pred, xs){
  return filter(complement(pred), xs);
}

export function compact(xs){
  return filter(identity, xs);
}

export function find(pred, xs){
  return Seq.first(filter(pred, xs));
}

export function flatten(xs){
  if (!Seqable.seq(xs)) return EMPTY;
  var fst = Seq.first(xs),
      rst = Seq.rest(xs);
  return satisfies(Seqable, fst) ? flatten(concat(fst, rst)) : new LazyList(fst, function(){
    return flatten(rst);
  });
}

export function cat(xs){
  const coll = compact(map(Seqable.seq, xs));
  if (!Seqable.seq(coll)) return EMPTY;
  const fst = Seq.first(coll);
  return new LazyList(Seq.first(fst), function(){
    const rst = Seq.rest(coll);
    return Seqable.seq(fst) ? cat([Seq.rest(fst)].concat(toArray(rst))) : cat(rst);
  });
}

export function concat(){
  return cat(slice(arguments));
}

export function mapcat(f, xs){
  return cat(map(f, xs));
}

export function toArray(xs){
  if (xs instanceof Array) return xs;
  return Seqable.seq(xs) ? into([], xs) : [];
}

export function toObject(obj){
  if (obj == null) return {};
  if (obj.constructor === Object) return obj;
  var coll = Seqable.seq(obj);
  if (!coll) return {};
  return Reduce.reduce(coll, Collection.conj, {});
}

export function iterate(generate, seed){
  return new LazyList(seed, function(){
    return iterate(generate, generate(seed));
  });
}

export const repeatedly = multiarity(function(f){
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
  var coll = Seqable.seq(xs) || Seqable.seq(ys);
  return coll ? new LazyList(Seq.first(coll), function(){
    return _cycle(Seq.rest(coll), ys);
  }) : EMPTY;
}

export const cycle = arity(1, _cycle);

function _dedupe(xs, x){
  const coll = Seqable.seq(xs),
        fst  = Seq.first(coll);
  return coll ? fst === x ?  _dedupe(Seq.rest(coll), fst) : new LazyList(fst, function(){
    return _dedupe(Seq.rest(coll), fst);
  }) : EMPTY;
}

export const dedupe = arity(1, _dedupe);

export function distinct(xs){
  var coll = Seqable.seq(xs);
  return coll ? toArray(new Set(coll)) : EMPTY;
}

export const range = multiarity(function(){ //TODO number range, date range, string range, etc.
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

export const transduce = multiarity(function(xform, f, coll){
  var xf = xform(f);
  return xf(Reduce.reduce(coll, xf, f()));
}, function(xform, f, seed, coll){
  return transduce(xform, seeding(f, constantly(seed)), coll);
});

export const into = multiarity(function(to, from){
  return Reduce.reduce(from, Collection.conj, to);
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