import {implement, blot, compact, map, conj, does} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';
import {_ as v} from "param.macro";

function check(self, value){
  return blot(map(function(iss){
    return issue(self.constraint, conj(iss.path || [], self.key));
  }, compact(ICheckable.check(self.constraint, value))));
}

export default does(
  implement(ICheckable, {check}));