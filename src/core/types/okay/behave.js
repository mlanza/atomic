import {IFunctor, IForkable} from '../../protocols';
import {does, overload} from '../../core';
import {implement} from '../protocol';
import {okay} from './construct';
import {isError} from '../error/construct';

function fmap(self, f){
  try{
    return okay(f(self.value));
  } catch (ex) {
    return isError(ex) ? ex : new Error(ex);
  }
}

function fork(self, reject, resolve){
  return resolve(self);
}

export const behaveAsOkay = does(
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));