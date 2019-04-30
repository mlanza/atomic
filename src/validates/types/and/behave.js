import {implement, does, maybe, mapcat, blot, toArray, compact, conj, apply, IAppendable} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {and} from "./construct";
import {issue} from '../issue';

function check(self, value){
  return maybe(mapcat(function(constraint){
    return ICheckable.check(constraint, value);
  }, self.constraints), compact, toArray, blot);
}

function append(self, constraint){
  return apply(and, conj(self.constraints, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));