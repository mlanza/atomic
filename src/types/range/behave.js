import {overload, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {IArray, IBounds, ISerialize, ISteppable, ISequential, ICollection, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IShow, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive, between} from '../../protocols';
import {reduced, unreduced, isReduced} from '../reduced';
import {lazySeq} from '../lazyseq';
import {iterable} from '../lazyseq/behave';

function seq(self){
  return self === self.constructor.EMPTY ? null : self;
}

function start(self){
  return self.start;
}

function end(self){
  return self.end;
}

function first(self){
  return IComparable.compare(self.start, self.end) * self.direction < 0 ? self.start : null;
}

function rest(self){
  return next(self) || self.constructor.EMPTY;
}

function next(self){
  if (self === self.constructor.EMPTY) return null;
  const stepped = ISteppable.step(self.step, self.start);
  return (IComparable.compare(stepped, self.end) * self.direction) < 0 ? new self.constructor(stepped, self.end, self.step, self.direction) : null;
}

function equiv(self, other){
  return IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end) && IEquiv.equiv(self.step, other.step);
}

function reduce(self, xf, init){
  let memo = init,
      coll = self;
  while(!isReduced(memo) && coll){
    memo = xf(memo, ISeq.first(coll));
    coll = INext.next(coll);
  }
  return unreduced(memo);
}

function toArray(self){
  return reduce(self, function(memo, date){
    memo.push(date);
    return memo;
  }, []);
}

function emptyable(Type){
  implement(IEmptyableCollection, {empty: constantly(Type.EMPTY)}, Type);
}

function serializable(Type){

  function serialize1(self){
    return serialize2(self, "@type");
  }

  function serialize2(self, key){
    return ISerialize.serialize(IAssociative.assoc({data: Object.assign({}, self)}, key, self[Symbol.toStringTag]), key);
  }

  const serialize = overload(null, serialize1, serialize2);

  implement(ISerialize, {serialize}, Type);
}

export default effect(
  iterable,
  emptyable,
  serializable,
  implement(ISequential),
  implement(IInclusive, {includes: between}),
  implement(ISeqable, {seq}),
  implement(IBounds, {start, end}),
  implement(IArray, {toArray}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));