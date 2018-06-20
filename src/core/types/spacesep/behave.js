import {constantly, identity, effect, overload} from '../../core';
import {implement} from '../protocol';
import {filtera, detect} from '../../types/lazyseq/concrete';
import {ISequential, IDeref, IArray, ICounted, ICollection, IInclusive, IYank} from '../../protocols';

function seq(self){
  const text = self.element.getAttribute(self.key);
  return text && text.length ? text.split(" ") : null;
}

function includes(self, text){
  return detect(function(t){
    return t == text;
  }, seq(self));
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

export default effect(
  implement(ISequential),
  implement(IDeref, {deref}),
  implement(IInclusive, {includes}),
  implement(IYank, {yank}),
  implement(ICounted, {count}),
  implement(ICollection, {conj}),
  implement(IArray, {toArray: deref}));