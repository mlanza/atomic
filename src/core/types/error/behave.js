import {IFunctor, IFold} from '../../protocols';
import {identity, constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import Error from './construct';

function fold(self, error, ok){
  error(self);
}

export default effect(
  implement(IFold, {fold}),
  implement(IFunctor, {fmap: identity}));