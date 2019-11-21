import {IFunctor, IFork} from '../../protocols';
import {identity, does} from '../../core';
import {implement} from '../protocol';

function fork(self, reject, resolve){
  return reject(self);
}

export const behaveAsError = does(
  implement(IFork, {fork}),
  implement(IFunctor, {fmap: identity}));