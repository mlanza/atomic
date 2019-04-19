import {implement, does, mapcat, first, compact, maybe, Array} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function check(self, value){
  return maybe(mapcat(function(constraint){
    return ICheckable.check(constraint, value);
  }, self.constraints), compact, first, issue, Array);
}

export default does(
  implement(ICheckable, {check}));