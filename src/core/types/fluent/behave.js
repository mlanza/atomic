import {implement} from '../protocol';
import {does} from '../../core';
import {fluent} from './construct';
import {IFunctor} from '../../protocols';

function fmap(self, f){
  return fluent(f(self.value) || self.value);
}

export default does(
  implement(IFunctor, {fmap}));