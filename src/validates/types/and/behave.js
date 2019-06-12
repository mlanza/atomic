import {implement, does, map, blot, compact, conj, apply, IAppendable} from 'atomic/core';
import {ICheckable} from '../../protocols';
import {and} from "./construct";
import {issue, issues} from '../issue';
import {_ as v} from "param.macro";

function check(self, value){
  return issues(self.constraints, ICheckable.check(v, value));
}

function append(self, constraint){
  return apply(and, conj(self.constraints, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));