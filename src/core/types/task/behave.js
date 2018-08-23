import {IFunctor, IFork, ISubscribe, IChainable} from '../../protocols';
import {identity, constantly, does, overload, noop} from '../../core';
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

function sub(self, callback){
  fork(self, console.error, callback);
}

export default does(
  implement(ISubscribe, {sub}),
  implement(IChainable, {chain}),
  implement(IFork, {fork}),
  implement(IFunctor, {fmap}));