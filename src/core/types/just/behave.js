import {implement} from '../protocol';
import {identity, does} from '../../core';
import {just} from './construct';
import {IFunctor, IOtherwise, IFork, IDeref} from '../../protocols';

function fmap(self, f){
  return just(f(self.value));
}

function otherwise(self, other){
  return self.value;
}

function fork(self, reject, resolve){
  return resolve(self.value);
}

function deref(self){
  return self.value;
}

export const behaveAsJust = does(
  implement(IDeref, {deref}),
  implement(IFork, {fork}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));