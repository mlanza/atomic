import {implement, does, map, first, filter, isSome, conj, IAppendable} from 'cloe/core';
import {ICheckable} from '../../protocols';
import {or} from './construct';
import {_ as v} from "param.macro";

function check(self, value){
  return first(filter(isSome, map(ICheckable.check(v, value), self.constraints)));
}

function append(self, constraint){
  return apply(or, conj(self.constraints, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));