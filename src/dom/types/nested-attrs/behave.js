import {constantly, identity, does, overload, implement, mapa, compact, trim, split, str, IDescriptive, ISeqable, IMap, IAssociative, ILookup, IDeref, IObject, IArray, ICounted, ICollection, IReduce, IInclusive, IYank} from 'cloe/core';

function asText(obj){
  return mapa(function(entry){
    const key = entry[0], value = entry[1];
    return str(key, ": ", value, ";");
  }, ISeqable.seq(obj)).join(" ");
}

function deref(self){
  const text = self.element.getAttribute(self.key)
  return text == null ? {} : IReduce.reduce(mapa(function(text){
    return mapa(trim, split(text, ":"));
  }, compact(split(text, ";"))), function(memo, pair){
    return ICollection.conj(memo, pair);
  }, {});
}

function lookup(self, key){
  return ILookup.lookup(deref(self), key);
}

function contains(self, key){
  return IAssociative.contains(deref(self), key);
}

function assoc(self, key, value){
  self.element.setAttribute(self.key, asText(IAssociative.assoc(deref(self), key, value)));
  return self;
}

function dissoc(self, key){
  self.element.setAttribute(self.key, asText(IMap.dissoc(deref(self), key)));
  return self;
}

function keys(self){
  return IMap.keys(deref(self));
}

function vals(self){
  return IMap.vals(deref(self));
}

function includes(self, pair){
  return IInclusive.includes(deref(self), pair);
}

function yank(self, pair){
  self.element.setAttribute(self.key, asText(IYank.yank(deref(self), pair)));
  return self;
}

function conj(self, pair){
  self.element.setAttribute(self.key, asText(ICollection.conj(deref(self), pair)));
  return self;
}

export default does(
  implement(IDescriptive),
  implement(IDeref, {deref}),
  implement(IMap, {keys, vals, dissoc}),
  implement(IInclusive, {includes}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IYank, {yank}),
  implement(ICollection, {conj}),
  implement(IObject, {toObject: deref}));