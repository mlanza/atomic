import {implement} from '../protocol';
import {identity, constantly, effect} from '../../core';
import {maybe} from './construct';
import {IFunctor, IOtherwise, IFold} from '../../protocols';

function fmap(self, f){
  return maybe(f(self.value));
}

function otherwise(self, other){
  return self.value;
}

function fold(self, error, okay){
  okay(self);
}

export default effect(
  implement(IFold, {fold}),
  implement(IOtherwise, {otherwise}),
  implement(IFunctor, {fmap}));