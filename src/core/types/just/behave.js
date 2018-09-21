import {implement} from '../protocol';
import {identity, does} from '../../core';
import {maybe} from './construct';
import {IFunctor, IOtherwise, IFork} from '../../protocols';

function fmap(self, f){
  return maybe(f(self.value));
}

function otherwise(self, other){
  return self.value;
}

function fork(self, reject, resolve){
  return resolve(self);
}

export default does(
  implement(IFork, {fork}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));