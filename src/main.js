import "./types";
import {EMPTY} from "./types/empty";
import {concat as concatN} from "./types/concatenated";
import {cons} from "./types/list";
import {slice, constantly, overload, identity, partial, reducing, complement, comp, upperCase} from "./core";
import {next} from "./protocols/inext";
import {first, rest, toArray} from "./protocols/iseq";
import {lazySeq} from "./types/lazyseq";
import {reduced} from "./types/reduced";
import {transduced} from "./types/transduced";
import {concatenated} from "./types/concatenated";
import Reduced from "./types/reduced";
import {seq} from "./protocols/iseqable";
import {count} from "./protocols/icounted";
import {show} from "./protocols/ishow";
import {reduce} from "./protocols/ireduce";
import {reduce as reduceIndexed} from "./core";

export * from "./core";
export * from "./protocols";

export const log = console.log.bind(console);

export function isSome(x){
  return x != null;
}

export function isNil(x){
  return x == null;
}

export function isZero(x){
  return x === 0;
}

export function isPos(x){
  return x > 0;
}

export function isNeg(x){
  return x < 0;
}

export function isOdd(n){
  return n % 2;
}

export const isEven  = complement(isOdd);

export function second(xs){
  return first(next(xs));
}

export function isEmpty(coll){
  return !seq(coll);
}

export function notEmpty(coll){
  return isEmpty(coll) ? null : coll;
}

export const concat = overload(constantly(EMPTY), seq, concatN);

export function each(f, xs){
  var ys = seq(xs);
  while(ys){
    f(first(ys));
    ys = seq(rest(ys));
  }
}

function cat(xf){
  return overload(xf, xf, function(memo, value){
    return reduce(value, xf, memo);
  });
}

function map1(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(memo, f(value));
    });
  }
}

function map2(f, xs){
  return seq(xs) === null ? EMPTY : lazySeq(f(first(xs)), function(){
    return map2(f, rest(xs));
  });
}

function mapN(f, ...tail){
  return map2(f, concat.apply(null, tail));
}

export const map = overload(null, map1, map2, mapN);

function take1(n){
  return function(xf){
    var taking = n;
    return overload(xf, xf, function(memo, value){
      return taking-- > 0 ? xf(memo, value) : reduced(memo);
    });
  }
}

function take2(n, coll){
  const xs = seq(coll);
  return n > 0 && xs ? lazySeq(first(xs), function(){
    return take2(n - 1, rest(xs));
  }) : EMPTY;
}

export const take = overload(null, take1, take2);

function repeatedly1(f){
  return lazySeq(f(), function(){
    return repeatedly1(f);
  });
}

function repeatedly2(n, f){
  return take2(n, repeatedly1(f));
}

function repeat1(x){
  return repeatedly1(constantly(x));
}

function repeat2(n, x){
  return repeatedly2(n, constantly(x));
}

export const repeat = overload(null, repeat1, repeat2);

export function iterate(f, x){
  return lazySeq(x, function(){
    return iterate(f, f(x));
  })
}

function add2(x, y){
  return x + y;
}

function subtract2(x, y){
  return x - y;
}

function multiply2(x, y){
  return x * y;
}

function divide2(x, y){
  return x / y;
}

function subtract1(x){
  return subtract2(0, x);
}

function divide1(x){
  return divide2(1, x);
}

function str1(x){
  return x == null ? "" : x.toString();
}

function str2(x, y){
  return str1(x) + str1(y);
}

function min2(x, y){
  return x < y ? x : y;
}

function max2(x, y){
  return x > y ? x : y;
}

export const min = overload(null, identity, min2, reducing(min2));
export const max = overload(null, identity, max2, reducing(max2));
export const str = overload(constantly(""), str1, str2, reducing(str2));
export const add = overload(constantly(0), identity, add2, reducing(add2));
export const subtract = overload(constantly(0), subtract1, subtract2, reducing(subtract2));
export const multiply = overload(constantly(1), identity, multiply2, reducing(multiply2));
export const divide = overload(null, divide1, divide2, reducing(divide2));
export const inc = partial(add2, +1);
export const dec = partial(add2, -1);

function range0(){
  return iterate(inc, 0);
}

function range1(end){
  return range3(0, end, 1);
}

function range2(start, end){
  return range3(start, end, 1);
}

function range3(start, end, step){
  return start < end ? lazySeq(start, function(){
    return range3(start + step, end, step);
  }) : EMPTY;
}

export const range = overload(range0, range1, range2, range3);

export function integers(){
  return iterate(inc, 1);
}

function interleave2(xs, ys){
  const as = seq(xs),
        bs = seq(ys);
  return as != null && bs != null ? cons(first(as), lazySeq(first(bs), function(){
    return interleave2(rest(as), rest(bs));
  })) : EMPTY;
}

function interleaveN(){
  return concatenated(interleaved.apply(null, slice(arguments)));
}

function interleaved(){
  const args = slice(arguments);
  return toArray(filter2(seq, args)).length === args.length ? lazySeq(toArray(map2(first, args)), function(){
    return interleaved.apply(null, toArray(map2(rest, args)));
  }) : EMPTY;
}

export const interleave = overload(null, null, interleave2, interleaveN);

function drop1(n){
  return function(xf){
    var dropping = n;
    return overload(xf, xf, function(memo, value){
      return dropping-- > 0 ? memo : xf(memo, value);
    });
  }
}

function drop2(n, coll){
  var i = n,
      xs = seq(coll)
  while (i > 0 && xs) {
    xs = rest(xs);
    i = i - 1;
  }
  return xs;
}

export const drop = overload(null, drop1, drop2);

function interpose1(sep){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(seq(memo) ? xf(memo, sep) : memo, value);
    });
  }
}

function interpose2(sep, xs){
  return drop2(1, interleave2(repeat1(sep), xs));
}

export const interpose = overload(null, interpose1, interpose2);

export const repeatedly = overload(null, repeatedly1, repeatedly2);

export function cycle(coll){
  return seq(coll) ? lazySeq(first(coll), function(){
    return concat(rest(coll), cycle(coll));
  }) : EMPTY;
}

function filter1(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? xf(memo, value) : memo;
    });
  }
}

function filter2(pred, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const head = first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter2(pred, rest(coll));
  }) : filter2(pred, rest(coll));
}

const filter = overload(null, filter1, filter2);

function keep1(f){
  return comp(map1(f), filter1(isSome));
}

function keep2(f, xs){
  return filter2(isSome, map2(f, xs));
}

const keep = overload(null, keep1, keep2);

export function indexed(iter){
  return function(f, xs){
    var idx = -1;
    return iter(function(x){
      return f(++idx, x);
    }, xs);
  }
}

function mapIndexed1(f){
  return function(xf){
    var idx = -1;
    return overload(xf, xf, function(memo, value){
      return xf(memo, f(++idx, value));
    });
  }
}

const mapIndexed2  = indexed(map2);

export const mapIndexed  = overload(null, mapIndexed1, mapIndexed2);

function keepIndexed1(f){
  return comp(mapIndexed1(f), filter1(isSome));
}

const keepIndexed2 = indexed(keep2);

export const keepIndexed = overload(null, keepIndexed1, keepIndexed2);

export const remove1 = comp(filter, complement);

function remove2(pred, xs){
  return filter2(complement(pred), xs);
}

export const remove  = overload(null, remove1, remove2);

function compact0(){
  return filter1(identity);
}

const compact1 = partial(filter2, identity);

export const compact = overload(compact0, compact1);

function partition2(n, xs){
  return partition3(n, n, xs);
}

function partition3(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, partition3(n, step, drop(step, coll))) : EMPTY;
}

function partition4(n, step, pad, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, partition4(n, step, pad, drop(step, coll))) : cons(take(n, concat(part, pad)));
}

export const partition = overload(null, null, partition2, partition3, partition4);

export function partitionAll2(n, xs){
  return partitionAll3(n, n, xs);
}

export function partitionAll3(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  return cons(take(n, coll), partition3(n, step, drop(step, coll)));
}

export const partitionAll = overload(null, null, partitionAll2, partitionAll3); //TODO transducer

function partitionBy2(f, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const head = first(coll),
        val  = f(head),
        run  = cons(head, takeWhile2(function(x){
          return val === f(x);
        }, next(coll)));
  return cons(run, partitionBy2(f, seq(drop(count(run), coll))));
}

export const partitionBy = overload(null, null, partitionBy2); //TODO transducer

function takeWhile1(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? xf(memo, value) : reduced(memo);
    });
  }
}

function takeWhile2(pred, xs){
  if (!seq(xs)) return EMPTY;
  const item = first(xs);
  return pred(item) ? lazySeq(item, function(){
    return takeWhile2(pred, rest(xs));
  }) : EMPTY;
}

export const takeWhile = overload(null, takeWhile1, takeWhile2);

function takeNth1(n){
  return function(xf){
    var x = -1;
    return overload(xf, xf, function(memo, value){
      x++;
      return x === 0 || x % n === 0 ? xf(memo, value) : memo;
    });
  }
}

function takeNth2(n, xs){
  return seq(xs) ? lazySeq(first(xs), function(){
    return takeNth2(n, drop2(n, xs));
  }) : EMPTY;
}

export const takeNth = overload(null, takeNth1, takeNth2);

function dropWhile1(pred){
  return function(xf){
    var dropping = true;
    return overload(xf, xf, function(memo, value){
      !dropping || (dropping = pred(value));
      return dropping ? memo : xf(memo, value);
    });
  }
}

function dropWhile2(pred, xs){
  return seq(xs) ? pred(first(xs)) ? dropWhile2(pred, rest(xs)) : xs : EMPTY;
}

export const dropWhile = overload(null, dropWhile1, dropWhile2);

function splay(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(memo, f.apply(null, value));
    });
  }
}

const sequence2 = transduced;

function sequenceN(xf){
  return sequence2(comp(splay, xf), interleave.apply(null, toArray(partition2(arguments.length - 1, rest(slice(arguments))))));
}

export const sequence = overload(null, null, sequence2, sequenceN);

const stooges = ["Larry", "Curly", "Moe"];
log(show(take(5, integers())));
log(show(interleave(["A","B","C","D","E"], repeat("="), integers())));
log(show(interleave([1,2,3],[10,11,12])));
log(show(interleaved([1,2,3], ["A","B","C"])));
const loud = sequence(comp(filter(function(x){
  return x.length > 3;
}), map(upperCase)), stooges);
log(show(cons(1,2,3)));
log(show(loud));
log(show(sequence(cat,[[1,2,3], [4,5,6]])))
log(show(stooges));
log(show(take(11, cycle(["A","B","C"]))));
log(show(rest(["A","B","C"])));
log(show(repeatedly(11, constantly(4))));
log(show(concat(stooges, ["Shemp", "Corey"])));
log(show(range(4)));
log(show({ace: 1, king: 2}));
log(show(seq({ace: 1, king: 2})));
log(show(second(stooges)));