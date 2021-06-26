import {constantly, identity, does, overload, implement, mapa, compact, trim, split, str, ICoerceable, IDescriptive, ISeqable, IMap, IAssociative, ILookup, IDeref, ICounted, ICollection, IReduce, IInclusive, IYankable} from "atomic/core";
import {ITransientYankable, ITransientAssociative, ITransientMap, ITransientCollection} from "atomic/transients";

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
}

function dissoc(self, key){
  self.element.setAttribute(self.key, asText(IMap.dissoc(deref(self), key)));
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
  self.element.setAttribute(self.key, asText(IYankable.yank(deref(self), pair)));
}

function conj(self, pair){
  self.element.setAttribute(self.key, asText(ICollection.conj(deref(self), pair)));
}

export default does(
  implement(IDescriptive),
  implement(IDeref, {deref}),
  implement(IMap, {keys, vals}),
  implement(ITransientMap, {dissoc}),
  implement(IInclusive, {includes}),
  implement(IAssociative, {contains}),
  implement(ITransientAssociative, {assoc}),
  implement(ILookup, {lookup}),
  implement(ITransientYankable, {yank}),
  implement(ITransientCollection, {conj}),
  implement(ICoerceable, {toObject: deref}));