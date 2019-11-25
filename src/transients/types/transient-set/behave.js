import {does, identity, implement, overload, assoc, cons, filter, lazySeq, emptyList, apply, unreduced, ICoerce, ISeq, IReduce, ISeqable, ISet, INext, ISequential, ICounted, ICollection, IEmptyableCollection, IInclusive, ICloneable, IEncode} from "atomic/core";
import {emptyTransientSet, transientSet} from './construct';
import {IPersistent, ITransientSet, ITransientEmptyableCollection, ITransientCollection} from "../../protocols";
import {_ as v} from "param.macro";

function encode(self, label){
  const xs = reduce(self, function(memo, value){
    memo.push(IEncode.encode(value, label));
    return memo;
  }, []);
  return assoc({}, label, "Set", "args", [xs]);
}

function seq(self){
  return count(self) ? self : null;
}

function empty(self){
  self.clear();
}

function disj(self, value){
  self.delete(value);
}

function includes(self, value){
  return self.has(value);
}

function conj(self, value){
  self.add(value);
}

function first(self){
  return self.values().next().value;
}

function seqVals1(iter){
  return seqVals2(iter, emptyList());
}

function seqVals2(iter, done){
  const res = iter.next();
  return res.done ? done : lazySeq(function(){
    return cons(res.value, seqVals1(iter));
  });
}

const seqVals = overload(null, seqVals1, seqVals2);

function rest(self){
  const iter = self.values();
  iter.next();
  return seqVals(iter);
}

function next(self){
  const iter = self.values();
  iter.next();
  return seqVals(iter, null);
}

function count(self){
  return self.size;
}

const toArray = Array.from;

function clone(self){
  return transientSet(toArray(self));
}

function reduce(self, xf, init){
  let memo = init;
  let coll = seq(self);
  while(coll){
    memo = xf(memo, first(coll));
    coll = next(coll);
  }
  return unreduced(memo);
}

export const behaveAsTransientSet = does(
  implement(ISequential),
  implement(IEncode, {encode}),
  implement(ITransientCollection, {conj}),
  implement(ITransientSet, {disj}), //TODO unite
  implement(IReduce, {reduce}),
  implement(ICoerce, {toArray}),
  implement(ISeqable, {seq}),
  implement(IInclusive, {includes}),
  implement(ICloneable, {clone}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}))