import {overload, identity, does, partial, comp} from "../../core.js";
import {implement} from "../protocol.js";
import {IBlankable, ICompactible, IFunctor, IReversible, IOmissible, ICoercible, IInclusive, IFind, IEquiv, ICollection, INext, ISeq, IReducible, IKVReducible, ISeqable, ISequential, IIndexed, IEmptyableCollection, ICounted, IAppendable, IPrependable} from "../../protocols.js";
import {isReduced, reduced, unreduced} from "../reduced.js";
import {concat} from "../concatenated/construct.js";
import {cons} from "../list/construct.js";
import {map, filter, remove, detect} from "./concrete.js";
import {emptyList} from "../empty-list/construct.js";
import {toArray} from "../array/concrete.js";
import {iequiv} from "../empty-list/behave.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import Symbol from "symbol";
import * as p from "./protocols.js";

const compact1 = partial(filter, identity);

function compact2(self, pred){
  return remove(pred, self);
}

const compact = overload(null, compact1, compact2);

function fmap(self, f){
  return map(f, self);
}

function conj(self, value){
  return cons(value, self);
}

function seq(self){
  return p.seq(self.perform());
}

function blank(self){
  return seq(self) == null;
}

function iterate(self){
  let state = self;
  return {
    next: function(){
      let result = p.seq(state) ? {value: p.first(state), done: false} : {done: true};
      state = p.next(state);
      return result;
    }
  };
}

function iterator(){
  return iterate(this);
}

export function iterable(Type){
  Type.prototype[Symbol.iterator] = iterator;
}

export function find(coll, key){
  return reducekv(coll, function(memo, k, v){
    return key === k ? reduced([k, v]) : memo;
  }, null);
}

function first(self){
  return p.first(self.perform());
}

function rest(self){
  return p.rest(self.perform());
}

function next(self){
  return p.seq(p.rest(self));
}

function nth(self, n){
  let xs  = self,
      idx = 0;
  while(xs){
    let x = p.first(xs);
    if (idx === n) {
      return x;
    }
    idx++;
    xs = p.next(xs);
  }
  return null;
}

function idx(self, x){
  let xs = p.seq(self),
      n  = 0;
  while(xs){
    if (x === p.first(xs)) {
      return n;
    }
    n++;
    xs = p.next(xs);
  }
  return null;
}

function reduce(xs, f, init){
  let memo = init,
      ys = p.seq(xs);
  while(ys && !isReduced(memo)){
    memo = f(memo, p.first(ys));
    ys = p.next(ys);
  }
  return unreduced(memo);
}

function reducekv(xs, f, init){
  let memo = init,
      ys = p.seq(xs),
      idx = 0;
  while(ys && !isReduced(memo)){
    memo = f(memo, idx++, p.first(ys));
    ys = p.next(ys);
  }
  return unreduced(memo);
}

function count(self){
  return reduce(self, function(memo){
    return memo + 1;
  }, 0);
}

function append(self, other){
  return concat(self, [other]);
}

function omit(self, value){
  return remove(function(x){
    return x === value;
  }, self);
}

function includes(self, value){
  return detect(function(x){
    return x === value;
  }, self);
}

const reverse = comp(p.reverse, toArray);

export const reductive = does(
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}));

export default does(
  iterable,
  iequiv,
  reductive,
  keying("LazySeq"),
  implement(ISequential),
  implement(IIndexed, {nth, idx}),
  implement(IReversible, {reverse}),
  implement(IBlankable, {blank}),
  implement(ICompactible, {compact}),
  implement(IInclusive, {includes}),
  implement(IOmissible, {omit}),
  implement(IFunctor, {fmap}),
  implement(ICollection, {conj}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: conj}),
  implement(ICounted, {count}),
  implement(IFind, {find}),
  implement(IEmptyableCollection, {empty: emptyList}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(INext, {next}));
