import {identity, does, implement, filtera, locate, ISequential, ISeq, IDeref, ICoerce, ICounted, ICollection, IInclusive, IYank} from 'cloe/core';

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
  return self;
}

function yank(self, text){
  self.element.setAttribute(self.key, filtera(function(t){
    return t !== text;
  }, seq(self)).join(" "));
  return self;
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
  implement(IYank, {yank}),
  implement(ICounted, {count}),
  implement(ICollection, {conj}),
  implement(ICoerce, {toArray: deref}));