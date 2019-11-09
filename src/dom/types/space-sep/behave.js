import {identity, does, implement, filtera, locate, ISequential, ISeq, IDeref, ICoerce, ICounted, ICollection, IInclusive, IYankable} from 'atomic/core';
import {ITransientCollection, ITransientYankable} from 'atomic/transients';

function seq(self){
  const text = self.element.getAttribute(self.key);
  return text && text.length ? text.split(" ") : null;
}

function includes(self, text){
  const xs = seq(self);
  return xs && locate(xs, function(t){
    return t == text;
  });
}

function conj(self, text){
  self.element.setAttribute(self.key, deref(self).concat(text).join(" "));
}

function yank(self, text){
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

export const behaveAsSpaceSeparated = does(
  implement(ISequential),
  implement(ISeq, {seq}),
  implement(IDeref, {deref}),
  implement(IInclusive, {includes}),
  implement(ITransientYankable, {yank}),
  implement(ICounted, {count}),
  implement(ITransientCollection, {conj}),
  implement(ICoerce, {toArray: deref}));