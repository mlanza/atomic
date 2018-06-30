import {implement} from '../protocol';
import {effect} from '../../core';
import {fluent} from './construct';
import {IFunctor} from '../../protocols';

function fmap(self, f){
  return fluent(f(self.value) || self.value);
}

export default effect(
  implement(IFunctor, {fmap}));