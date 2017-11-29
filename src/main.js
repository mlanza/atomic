import "./types/array/impl";
import "./types/indexedseq/impl";
import "./types/empty/impl";
import "./types/lazyseq/impl";
import "./types/nil/impl";
import "./types/list/impl";
import "./types/string/impl";
import "./types/number/impl";
import "./types/date/impl";
import "./types/object/impl";
import "./types/objectselection/impl";
import {EMPTY} from "./types/empty";
import {cons} from "./types/list";
import {constantly, overload, identity, partial} from "./core";
import {next} from "./protocols/inext";
import {first, rest, toArray} from "./protocols/iseq";
import {lazySeq} from "./types/lazyseq";
import {seq} from "./protocols/iseqable";
import {show} from "./protocols/ishow";

export * from "./core";
export * from "./protocols/inext";
export * from "./protocols/iseq";
export * from "./protocols/iindexed";
export * from "./protocols/iseqable";
export * from "./protocols/ishow";
export * from "./protocols/icollection";

export const log = console.log.bind(console);

export function second(xs){
  return first(next(xs));
}

export function isEmpty(coll){
  return !seq(coll);
}

export function notEmpty(coll){
  return isEmpty(coll) ? null : coll;
}

export function concat(xs, ...tail){
  if (arguments.length === 0) {
    return EMPTY;
  } else if (arguments.length === 1) {
    return seq(xs);
  } else if (arguments.length > 1) {
    return lazySeq(first(xs), function(){
      var ys = rest(xs);
      return concat.apply(this, (ys === EMPTY ? [] : [ys]).concat(tail));
    });
  }
}

export function each(f, xs){
  var ys = seq(xs);
  while(ys){
    f(first(ys));
    ys = seq(rest(ys));
  }
}

function mapN(f, ...tail){
  var xs = concat.apply(null, tail);
  return xs === null ? EMPTY : lazySeq(f(first(xs)), function(){
    return mapN(f, rest(xs));
  });
}

export const map = overload(null, null, mapN);

function take2(n, coll){
  var xs = seq(coll);
  return n > 0 && xs ? lazySeq(first(xs), function(){
    return take2(n - 1, rest(xs));
  }) : EMPTY;
}

export const take = overload(null, null, take2);

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

function add0(){
  return 0;
}

function add2(x, y){
  return x + y;
}

function addN(x, ...tail){
  return tail.length ? x + addN.apply(null, tail) : x;
}

export const add = overload(add0, identity, add2, addN);
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
  var as = seq(xs),
      bs = seq(ys);
  return as != null && bs != null ? cons(first(as), lazySeq(first(bs), function(){
    return interleave2(rest(as), rest(bs));
  })) : EMPTY;
}

function interleaveN(){
  var args = Array.prototype.slice.call(arguments);
  var next = toArray(mapN(first, args));
  if (next.length === 0 || next.indexOf(null) > -1) {
    return EMPTY;
  }
  var remain = toArray(mapN(rest, args));
  var s = lazySeq(next.pop(), function(){
    return interleaveN.apply(this, remain);
  })
  while (next.length) {
    s = cons(next.pop(), s);
  }
  return s;
}

export const interleave = overload(null, null, interleave2, interleaveN);

function drop2(n, coll){
  var i = n,
      xs = seq(coll)
  while (i > 0 && xs) {
    xs = rest(xs);
    i = i - 1;
  }
  return xs;
}

export const drop = overload(null, null, drop2);

function interpose2(sep, xs){
  return drop2(1, interleave2(repeat1(sep), xs));
}

export const interpose = overload(null, null, interpose2);

export const repeatedly = overload(null, repeatedly1, repeatedly2);

export function cycle(coll){
  return seq(coll) ? lazySeq(first(coll), function(){
    return concat(rest(coll), cycle(coll));
  }) : EMPTY;
}

var stooges = ["Larry", "Curly", "Moe"];
var larry = first(stooges);
var bros = rest(stooges);
log(show(stooges));
log(show(take(11, cycle(["A","B","C"]))));
log(show(rest(["A","B","C"])));
log(show(repeatedly(11, constantly(4))));
log(show(interleave(["A","B","C","D","E"], repeat("="), integers())));
log(show(concat(stooges, ["Shemp", "Corey"])));
log(show(range(4)));
log(show({ace: 1, king: 2}));
log(show(seq({ace: 1, king: 2})));
log(show(second(stooges)));
each(log, stooges);