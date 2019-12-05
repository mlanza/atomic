import {IFunctor, IForkable} from '../../protocols';
import {identity, does} from '../../core';
import {implement} from '../protocol';

function fork(self, reject, resolve){
  return reject(self);
}

export const behaveAsError = does(
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap: identity}));