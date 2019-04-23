import {implement, does, map, first, filter, isSome} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {_ as v} from "param.macro";

function check(self, value){
  return first(filter(isSome, map(ICheckable.check(v, value), self.constraints)));
}

export default does(
  implement(ICheckable, {check}));