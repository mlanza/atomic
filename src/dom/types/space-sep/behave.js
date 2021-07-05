import * as _ from "atomic/core";
import * as mut from "atomic/transients";

function seq(self){
  const text = self.element.getAttribute(self.key);
  return text && text.length ? text.split(" ") : null;
}

function includes(self, text){
  const xs = seq(self);
  return xs && _.filter(function(t){
    return t == text;
  }, xs);
}

function conj(self, text){
  self.element.setAttribute(self.key, deref(self).concat(text).join(" "));
}

function omit(self, text){
  self.element.setAttribute(self.key, _.filtera(function(t){
    return t !== text;
  }, seq(self)).join(" "));
}

function deref(self){
  return seq(self) || [];
}

function count(self){
  return deref(self).length;
}

export default _.does(
  _.implement(_.ISequential),
  _.implement(_.ISeq, {seq}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.ICoerceable, {toArray: deref}),
  _.implement(_.ICounted, {count}),
  _.implement(mut.ITransientOmissible, {omit}),
  _.implement(mut.ITransientCollection, {conj}));
