import {IFunctor, IFork} from '../../protocols';
import {identity, constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import Error from './construct';

function fork(self, reject, resolve){
  return reject(self);
}

export default effect(
  implement(IFork, {fork}),
  implement(IFunctor, {fmap: identity}));