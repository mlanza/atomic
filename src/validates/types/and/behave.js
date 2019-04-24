import {implement, does, maybe, mapcat, blot, toArray, compact} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, value){
  return maybe(mapcat(function(constraint){
    return ICheckable.check(constraint, value);
  }, self.constraints), compact, toArray, blot);
}

export default does(
  implement(ICheckable, {check}));