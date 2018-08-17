import {IFunctor, IFork} from '../../protocols';
import {identity, constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import Promise from './construct';

function fmap(self, f){
  return self.then(f);
}

function fork(self, reject, resolve){
  return self.then(resolve, reject);
}

export default effect(
  implement(IFork, {fork}),
  implement(IFunctor, {fmap}));