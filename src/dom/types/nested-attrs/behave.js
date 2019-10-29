import {deprecated, constantly, identity, does, overload, implement, mapa, compact, trim, split, str, ICoerce, IDescriptive, ISeqable, IMap, IAssociative, ILookup, IDeref, ICounted, ICollection, IReduce, IInclusive, IYankable} from 'atomic/core';
import {ITransientYankable, ITransientAssociative, ITransientMap, ITransientCollection} from 'atomic/transients';

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

function _assoc(self, key, value){
  self.element.setAttribute(self.key, asText(IAssociative.assoc(deref(self), key, value)));
}

function assoc(self, key, value){
  deprecated(self, "IAssociative.assoc deprecated. Use ITransientAssociative.assoc.");
  _assoc(self, key, value);
  return self;
}

function _dissoc(self, key){
  self.element.setAttribute(self.key, asText(IMap.dissoc(deref(self), key)));
}

function dissoc(self, key){
  deprecated(self, "IMap.dissoc deprecated. Use ITransientMap.dissoc.");
  _dissoc(self, key);
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

function _yank(self, pair){
  self.element.setAttribute(self.key, asText(IYankable.yank(deref(self), pair)));
}

function yank(self, pair){
  deprecated(self, "IYankable.yank deprecated. Use ITransientYankable.yank.");
  _yank(self, pair);
  return self;
}

function _conj(self, pair){
  self.element.setAttribute(self.key, asText(ICollection.conj(deref(self), pair)));
}

function conj(self, pair){
  deprecated(self, "ICollection.conj deprecated. Use ITransientCollection.conj.");
  _conj(self, pair);
  return self;
}

export default does(
  implement(IDescriptive),
  implement(IDeref, {deref}),
  implement(IMap, {keys, vals, dissoc}),
  implement(ITransientMap, {dissoc: _dissoc}),
  implement(IInclusive, {includes}),
  implement(IAssociative, {assoc, contains}),
  implement(ITransientAssociative, {assoc: _assoc}),
  implement(ILookup, {lookup}),
  implement(IYankable, {yank}),
  implement(ITransientYankable, {yank: _yank}),
  implement(ICollection, {conj}),
  implement(ITransientCollection, {conj: _conj}),
  implement(ICoerce, {toObject: deref}));