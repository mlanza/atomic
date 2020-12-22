import {implement, does, map, detect, isSome, ISeqable, INext, IEmptyableCollection, ICollection, ISeq, IAppendable} from 'atomic/core';
import {ICheckable} from '../../protocols';
import {or} from './construct';

function check(self, value){
  return detect(isSome, map(ICheckable.check(?, value), self.constraints));
}

function conj(self, constraint){
  return apply(or, ICollection.conj(self.constraints, constraint));
}

function first(self){
  return ISeq.first(self.constraints);
}

function rest(self){
  return ISeq.rest(self.constraints);
}

function empty(self){
  return or();
}

function seq(self){
  return ISeqable.seq(self.constraints) ? self : null;
}

function next(self){
  return seq(rest(self));
}

export const behaveAsOr = does(
  implement(ISeqable, {seq}),
  implement(INext, {next}),
  implement(IEmptyableCollection, {empty}),
  implement(ICollection, {conj}),
  implement(ISeq, {first, rest}),
  implement(IAppendable, {append: conj}),
  implement(ICheckable, {check}));