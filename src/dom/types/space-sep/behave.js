import {deprecated, identity, does, implement, filtera, locate, ISequential, ISeq, IDeref, ICoerce, ICounted, ICollection, IInclusive, IYankable} from 'atomic/core';
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

function _conj(self, text){
  self.element.setAttribute(self.key, deref(self).concat(text).join(" "));
}

function conj(self, text){
  deprecated(self, "ICollection.conj deprecated. Use ITransientCollection.conj.");
  _conj(self, text);
  return self;
}

function _yank(self, text){
  self.element.setAttribute(self.key, filtera(function(t){
    return t !== text;
  }, seq(self)).join(" "));
}

function yank(self, text){
  deprecated(self, "IYankable.yank deprecated. Use ITransientYankable.yank.");
  _yank(self, text);
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
  implement(IYankable, {yank}),
  implement(ITransientYankable, {yank: _yank}),
  implement(ICounted, {count}),
  implement(ITransientCollection, {conj: _conj}),
  implement(ICollection, {conj}),
  implement(ICoerce, {toArray: deref}));