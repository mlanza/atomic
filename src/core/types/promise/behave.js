import {IFunctor, IFold} from '../../protocols';
import {identity, constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import Promise from './construct';

function fmap(self, f){
  return self.then(f);
}

function fold(self, error, okay){
  return self.then(okay, error);
}

export default effect(
  implement(IFold, {fold}),
  implement(IFunctor, {fmap}));