import {implement} from '../protocol';
import {IArray, IInclusive, IFind, IEquiv, ICollection, INext, ISeq, IReduce, IKVReduce, ISeqable, ISequential, IIndexed, IEmptyableCollection, IShow, ICounted, IAppendable, IPrependable} from '../../protocols';
import {overload, identity, constantly, effect} from '../../core';
import Reduced, {isReduced, reduced, unreduced} from "../reduced";
import {concat} from "../concatenated/construct";
import EmptyList from '../emptylist/construct';

function reduce(self, xf, init){
  let memo = init,
      coll = seq(self);
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
  const xs = seq(as),
        ys = seq(bs);
  return xs === ys || (IEquiv.equiv(first(xs), first(ys)) && IEquiv.equiv(rest(xs), rest(ys)));
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

function show(self){
  var xs = IArray.toArray(ISeqable.seq(self));
  return "#" + self.constructor.name +  " [" + xs.map(IShow.show).join(", ") + "]";
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

function prepend(self, other){
  return concat([other], self);
}

const toArray = overload(null, toArray1, toArray2);

export const ishow = implement(IShow, {show: show});
export const ireduce = effect(
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}));

export default effect(
  iterable,
  ishow,
  ireduce,
  implement(ISequential),
  implement(IArray, {toArray}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IReduce, {reduce}),
  implement(ICounted, {count}),
  implement(IEquiv, {equiv}),
  implement(IFind, {find}),
  implement(IEmptyableCollection, {empty: EmptyList.EMPTY}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(INext, {next}));