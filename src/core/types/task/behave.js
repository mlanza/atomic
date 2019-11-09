import {IFunctor, IFork, IChainable} from '../../protocols';
import {identity, does, overload, noop} from '../../core';
import {implement} from '../protocol';
import {task} from './construct';
import {comp} from "../function/concrete";

function fmap(self, f){
  return task(function(reject, resolve){
    self.fork(reject, comp(resolve, f));
  });
}

function chain(self, f){
  return task(function(reject, resolve){
    self.fork(reject, function(value){
      IFork.fork(f(value), reject, resolve);
    });
  });
}

function fork(self, reject, resolve){
  self.fork(reject, resolve);
}

export const behaveAsTask = does(
  implement(IChainable, {chain}),
  implement(IFork, {fork}),
  implement(IFunctor, {fmap}));