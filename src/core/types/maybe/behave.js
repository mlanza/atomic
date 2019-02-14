import {implement} from '../protocol';
import {identity, does} from '../../core';
import {maybe} from './construct';
import {IFunctor, IOtherwise, IFork, IDeref} from '../../protocols';

function fmap(self, f){
  return self.value == null ? self : maybe(f(self.value));
}

function otherwise(self, other){
  return self.value == null ? other : self.value;
}

function fork(self, reject, resolve){
  return resolve(self.value == null ? null : self.value);
}

function deref(self){
  return self.value == null ? null : self.value;
}

export default does(
  implement(IDeref, {deref}),
  implement(IFork, {fork}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));