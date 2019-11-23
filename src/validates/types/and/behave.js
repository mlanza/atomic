import {implement, does, map, blot, compact, apply, ISeqable, INext, IEmptyableCollection, ISeq, IAppendable, ICollection} from 'atomic/core';
import {ICheckable} from '../../protocols';
import {and} from "./construct";
import {issue, issues} from '../issue';
import {_ as v} from "param.macro";

function check(self, value){
  return issues(self.constraints, ICheckable.check(v, value));
}

function conj(self, constraint){
  return apply(and, ICollection.conj(self.constraints, constraint));
}

function first(self){
  return ISeq.first(self.constraints);
}

function rest(self){
  return ISeq.rest(self.constraints);
}

function empty(self){
  return and();
}

function seq(self){
  return ISeqable.seq(self.constraints) ? self : null;
}

function next(self){
  return seq(rest(self));
}

export const behaveAsAnd = does(
  implement(ISeqable, {seq}),
  implement(INext, {next}),
  implement(IEmptyableCollection, {empty}),
  implement(ICollection, {conj}),
  implement(ISeq, {first, rest}),
  implement(IAppendable, {append: conj}),
  implement(ICheckable, {check}));