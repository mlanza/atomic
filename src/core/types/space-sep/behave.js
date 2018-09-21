import {identity, does} from '../../core';
import {implement} from '../protocol';
import {filtera} from '../../types/lazy-seq/concrete';
import {locate} from '../../protocols/ilocate/concrete';
import {ISequential, IDeref, IArray, ICounted, ICollection, IInclusive, IYank} from '../../protocols';

function seq(self){
  const text = self.element.getAttribute(self.key);
  return text && text.length ? text.split(" ") : null;
}

function includes(self, text){
  return locate(seq(self), function(t){
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
  implement(IDeref, {deref}),
  implement(IInclusive, {includes}),
  implement(IYank, {yank}),
  implement(ICounted, {count}),
  implement(ICollection, {conj}),
  implement(IArray, {toArray: deref}));