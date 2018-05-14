import {implement} from '../../protocol';
import {IFind, ICollection, INext, IArr, ISeq, IReduce, IKVReduce, ISeqable, ISequential, IIndexed, IEmptyableCollection, IShow} from '../../protocols';
import {overload, identity, constantly, effect} from '../../core';
import Reduced, {reduced} from "../reduced/construct";
import {EMPTY} from '../empty';

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
  var xs = IArr.toArray(ISeqable.seq(self));
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

const toArray = overload(null, toArray1, toArray2);

export const showable = implement(IShow, {show: show});
export const reduceable = effect(
  implement(IReduce, {_reduce: reduce}),
  implement(IKVReduce, {_reducekv: reducekv}));

export default effect(
  iterable,
  showable,
  reduceable,
  implement(IFind, {find: find}),
  implement(ISequential),
  implement(IEmptyableCollection, {empty: EMPTY}),
  implement(IArr, {toArray: toArray}),
  implement(ISeq, {first: first, rest: rest}),
  implement(ISeqable, {seq: identity}),
  implement(INext, {next: next}));