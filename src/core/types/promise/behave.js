import {IFunctor, IFork, IOtherwise} from '../../protocols';
import {identity, does, overload} from '../../core';
import {implement} from '../protocol';
import Promise from './construct';

function fmap(self, f){
  return self.then(f);
}

function fork(self, reject, resolve){
  return self.then(resolve, reject);
}

function otherwise(self, other){
  return fmap(self, function(value){
    return value == null ? other : value;
  });
}

export default does(
  implement(IOtherwise, {otherwise}),
  implement(IFork, {fork}),
  implement(IFunctor, {fmap}));