import {implement, implementation} from '../protocol';
import {IBlankable, ICompactable, ILocate, IQueryable, IFunctor, IReversible, IYankable, IMatchable, ICoerceable, IInclusive, IFind, IEquiv, ICollection, INext, ISeq, IReduce, IKVReduce, ISeqable, ISequential, IIndexed, IEmptyableCollection, ICounted, IAppendable, IPrependable} from '../../protocols';
import {overload, identity, does, partial} from '../../core';
import {Reduced, isReduced, reduced, unreduced} from "../reduced";
import {concat} from "../concatenated/construct";
import {comp} from "../function/concrete";
import {cons} from "../list/construct";
import {map, filter, detect} from "./concrete";
import {emptyList, EmptyList} from '../empty-list/construct';
import {Symbol} from '../symbol/construct';

const compact = partial(filter, identity);

function query(self, pred){
  return filter(pred, self);
}

function locate(self, pred){
  return detect(pred, self);
}

function fmap(self, f){
  return map(f, self);
}

function conj(self, value){
  return cons(value, self);
}

function seq(self){
  return ISeqable.seq(self.perform());
}

function blank(self){
  return seq(self) == null;
}

function iterate(self){
  let state = self;
  return {
    next: function(){
      let result = ISeqable.seq(state) ? {value: ISeq.first(state), done: false} : {done: true};
      state = INext.next(state);
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
  return ISeq.first(self.perform());
}

function rest(self){
  return ISeq.rest(self.perform());
}

function next(self){
  return ISeqable.seq(ISeq.rest(self));
}

function nth(self, n){
  let xs  = self,
      idx = 0;
  while(xs){
    let x = ISeq.first(xs);
    if (idx === n) {
      return x;
    }
    idx++;
    xs = INext.next(xs);
  }
  return null;
}

function idx(self, x){
  let xs = ISeqable.seq(self),
      n  = 0;
  while(xs){
    if (x === ISeq.first(xs)) {
      return n;
    }
    n++;
    xs = INext.next(xs);
  }
  return null;
}

function reduce(xs, xf, init){
  let memo = init,
      ys = ISeqable.seq(xs);
  while(ys && !(memo instanceof Reduced)){
    memo = xf(memo, ISeq.first(ys));
    ys = INext.next(ys);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function reducekv(xs, xf, init){
  let memo = init,
      ys = ISeqable.seq(xs),
      idx = 0;
  while(ys && !(memo instanceof Reduced)){
    memo = xf(memo, idx++, ISeq.first(ys));
    ys = INext.next(ys);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function toArray(xs){
  let ys = xs;
  const zs = [];
  while (ISeqable.seq(ys) != null) {
    zs.push(ISeq.first(ys));
    ys = ISeq.rest(ys);
  }
  return zs;
}

function count(self){
  return reduce(self, function(memo){
    return memo + 1;
  }, 0);
}

function append(self, other){
  return concat(self, [other]);
}

function yank(self, value){
  return remove(function(x){
    return x === value;
  }, self);
}

function includes(self, value){
  return ILocate.locate(self, function(x){
    return x === value;
  });
}

const reverse = comp(IReversible.reverse, toArray);

export const ireduce = does(
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}));

export const behaveAsLazySeq = does(
  iterable,
  ireduce,
  implement(IEquiv, implementation(IEquiv, EmptyList)),
  implement(ISequential),
  implement(IIndexed, {nth, idx}),
  implement(IReversible, {reverse}),
  implement(IBlankable, {blank}),
  implement(ICompactable, {compact}),
  implement(IInclusive, {includes}),
  implement(IQueryable, {query}),
  implement(ILocate, {locate}),
  implement(IYankable, {yank}),
  implement(IFunctor, {fmap}),
  implement(ICollection, {conj}),
  implement(ICoerceable, {toArray}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: conj}),
  implement(IReduce, {reduce}),
  implement(ICounted, {count}),
  implement(IFind, {find}),
  implement(IEmptyableCollection, {empty: emptyList}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(INext, {next}));