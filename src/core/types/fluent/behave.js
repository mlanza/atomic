import {implement} from '../protocol';
import {does} from '../../core';
import {fluent} from './construct';
import {IFunctor, IDeref} from '../../protocols';

function fmap(self, f){
  return fluent(f(self.value) || self.value);
}

function deref(self){
  return self.value;
}

export default does(
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}));