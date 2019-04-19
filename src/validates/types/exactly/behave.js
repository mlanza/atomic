import {implement, does, count, maybe, Array} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';
import {_ as v} from "param.macro";

function check(self, coll){
  return maybe(coll, count, function(n){
    return n !== self.n ? issue(self) : null;
  }, Array);
}

export default does(
  implement(ICheckable, {check}));