import {IFunctor, IForkable, IOtherwise} from '../../protocols';
import {identity, does, overload} from '../../core';
import {implement} from '../protocol';
import {Promise} from './construct';

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

export const behaveAsPromise = does(
  implement(IOtherwise, {otherwise}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));