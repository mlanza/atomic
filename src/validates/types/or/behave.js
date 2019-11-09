import {implement, does, map, detect, isSome, conj, IAppendable} from 'atomic/core';
import {ICheckable} from '../../protocols';
import {or} from './construct';
import {_ as v} from "param.macro";

function check(self, value){
  return detect(isSome, map(ICheckable.check(v, value), self.constraints));
}

function append(self, constraint){
  return apply(or, conj(self.constraints, constraint));
}

export const behaveAsOr = does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));