import {identity, does, implement, filtera, filter, ISequential, ISeq, IDeref, ICoerceable, ICounted, ICollection, IInclusive, IOmissible} from "atomic/core";
import {ITransientCollection, ITransientOmissible} from "atomic/transients";

function seq(self){
  const text = self.element.getAttribute(self.key);
  return text && text.length ? text.split(" ") : null;
}

function includes(self, text){
  const xs = seq(self);
  return xs && filter(function(t){
    return t == text;
  }, xs);
}

function conj(self, text){
  self.element.setAttribute(self.key, deref(self).concat(text).join(" "));
}

function omit(self, text){
  self.element.setAttribute(self.key, filtera(function(t){
    return t !== text;
  }, seq(self)).join(" "));
}

function deref(self){
  return seq(self) || [];
}

function count(self){
  return deref(self).length;
}

export default does(
  implement(ISequential),
  implement(ISeq, {seq}),
  implement(IDeref, {deref}),
  implement(IInclusive, {includes}),
  implement(ITransientOmissible, {omit}),
  implement(ICounted, {count}),
  implement(ITransientCollection, {conj}),
  implement(ICoerceable, {toArray: deref}));
