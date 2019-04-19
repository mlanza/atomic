import {implement, does, constantly, conj, maybe, concatenated, map, mapIndexed, compact, blot, toArray} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';
import {_ as v} from "param.macro";

function check(self, coll){
  return maybe(coll, mapIndexed(function(idx, item){
    return map(function(prob){
      return issue(self.constraint, conj(prob.path || [], idx));
    }, ICheckable.check(self.constraint, item));
  }, v), concatenated, compact, toArray, blot);
}

export default does(
  implement(ICheckable, {check}));