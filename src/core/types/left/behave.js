import {implement} from '../protocol';
import {identity, does} from '../../core';
import {IFunctor, IForkable, IDeref} from '../../protocols';

const fmap = identity;

function fork(self, reject, resolve){
  return reject(self.value);
}

function deref(self){
  return self.value;
}

export const behaveAsLeft = does(
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));