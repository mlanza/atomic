import {implement} from '../protocol';
import {IFunctor, IYank, IMatch, IArray, IInclusive, IFind, IEquiv, ICollection, INext, ISeq, IReduce, IKVReduce, ISeqable, ISequential, IIndexed, IEmptyableCollection, ICounted, IAppendable, IPrependable} from '../../protocols';
import {overload, identity, constantly, does} from '../../core';
import Reduced, {isReduced, reduced, unreduced} from "../reduced";
import {concat} from "../concatenated/construct";
import {cons} from "../list/construct";
import {map, detect} from "./concrete";
import {emptyList} from '../empty-list/construct';
import Symbol from '../symbol/construct';

function fmap(self, f){
  return map(f, self);
}

function conj(self, value){
  return cons(value, self);
}

function reduce(self, xf, init){
  let memo = init,
      coll = ISeqable.seq(self);
  while(coll){
    memo = xf(memo, first(coll))
    if (isReduced(memo)) {
      break;
    }
    coll = next(coll);
  }
  return unreduced(memo);
}

function equiv(as, bs){
  const xs = ISeqable.seq(as),
        ys = ISeqable.seq(bs);
  return ys == null ? false : xs === ys || (IEquiv.equiv(first(xs), first(ys)) && IEquiv.equiv(rest(xs), rest(ys)));
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
  return self.head;
}

function rest(self){
  return self.tail();
}

function next(self){
  return ISeqable.seq(ISeq.rest(self));
}

function reduce(xs, xf, init){
  var memo = init,
      ys = ISeqable.seq(xs);
  while(ys && !(memo instanceof Reduced)){
    memo = xf(memo, ISeq.first(ys));
    ys = next(ys);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function reducekv(xs, xf, init){
  var memo = init,
      ys = ISeqable.seq(xs);
  while(ys && !(memo instanceof Reduced)){
    let pair = ISeq.first(ys);
    memo = xf(memo, pair[0], pair[1]);
    ys = next(ys);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function toArray2(xs, ys){
  if (ISeqable.seq(xs) != null) {
    ys.push(ISeq.first(xs));
    return toArray2(ISeq.rest(xs), ys);
  }
  return ys;
}

function toArray1(xs){
  return toArray2(xs, []);
}

function count(self){
  return reduce(self, function(memo){
    return memo + 1;
  }, 0);
}

function append(self, other){
  return concat(self, [other]);
}

const toArray = overload(null, toArray1, toArray2);

function yank(self, value){
  return remove(function(x){
    return x === value;
  }, self);
}

function includes(self, value){
  return detect(function(x){
    return x === value;
  }, self);
}

export const ireduce = does(
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}));

export default does(
  iterable,
  ireduce,
  implement(ISequential),
  implement(IInclusive, {includes}),
  implement(IYank, {yank}),
  implement(IFunctor, {fmap}),
  implement(ICollection, {conj}),
  implement(IArray, {toArray}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: conj}),
  implement(IReduce, {reduce}),
  implement(ICounted, {count}),
  implement(IEquiv, {equiv}),
  implement(IFind, {find}),
  implement(IEmptyableCollection, {empty: emptyList}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(INext, {next}));