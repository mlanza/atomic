import {IFunctor, IFork} from '../../protocols';
import {identity, does} from '../../core';
import {implement} from '../protocol';
import Error from './construct';

function fork(self, reject, resolve){
  return reject(self);
}

export default does(
  implement(IFork, {fork}),
  implement(IFunctor, {fmap: identity}));