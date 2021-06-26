import {does, identity, implement, iterable, lazyIterable, ISeq, ISeqable, INext, IReduce, IMergable, ICoerceable, IKVReduce, IMap, ICounted, IAssociative, ILookup, IClonable} from "atomic/core";

function assoc(self, key, value){
  return self.set(key, value);
}

function contains(self, key){
  return self.has(key);
}

function lookup(self, key){
  return self.get(key);
}

function count(self){
  return self.size;
}

function keys(self){
  return lazyIterable(self.keys());
}

function vals(self){
  return lazyIterable(self.values());
}

function dissoc(self, key){
  return self.remove(self, key);
}

function reducekv(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, key, lookup(self, key));
  }, init);
}

function toArray(self){
  return self.toArray();
}

function merge(self, other){
  return reducekv(other, _.assoc, self);
}

function seq(self){
  return self.size ? lazyIterable(self.entries()) : null;
}

function first(self){
  return ISeq.first(seq(self));
}

function rest(self){
  return ISeq.rest(ISeqable.seq(self));
}

function next(self){
  return ISeqable.seq(ISeq.rest(self));
}

export default does(
  iterable,
  implement(IKVReduce, {reducekv}),
  implement(ICoerceable, {toArray}),
  implement(IMergable, {merge}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(IMap, {keys, vals, dissoc}),
  implement(IClonable, {clone: identity}),
  implement(ICounted, {count}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}));