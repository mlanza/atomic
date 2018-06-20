import {IFunctor, IFold} from '../../protocols';
import {effect, overload} from '../../core';
import {implement} from '../protocol';
import {okay} from './construct';
import Error, {isError} from '../error/construct';

function fmap(self, f){
  try{
    return okay(f(self.value));
  } catch (ex) {
    return isError(ex) ? ex : new Error(ex);
  }
}

function fold(self, error, okay){
  return okay(self);
}

export default effect(
  implement(IFold, {fold}),
  implement(IFunctor, {fmap}));