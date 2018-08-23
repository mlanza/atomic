import {IFunctor, IFork} from '../../protocols';
import {identity, constantly, does, overload} from '../../core';
import {implement} from '../protocol';
import Promise from './construct';

function fmap(self, f){
  return self.then(f);
}

function fork(self, reject, resolve){
  return self.then(resolve, reject);
}

export default does(
  implement(IFork, {fork}),
  implement(IFunctor, {fmap}));