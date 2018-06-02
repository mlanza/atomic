import {effect, identity, constantly} from '../../core';
import {implement} from '../protocol';
import {set, Set} from './construct';
import {ISeq, ISet, INext, ISequential, ICounted, ICollection, IEmptyableCollection, IInclusive, ICloneable} from '../../protocols';
import {EMPTY} from '../../types/empty/construct';

function union(self, other){
  return Set.union([self, other]);
}

function intersection(self, other){
  return Set.intersect([self, other]);
}

function toArray(self){
  return self.toArray();
}

function includes(self, value){
  return self.has(value);
}

function conj(self, value){
  return self.add(value);
}

function first(self){
  return self.first();
}

function rest(self){
  let tail = self.rest();
  return tail.size > 0 ? tail : EMPTY;
}

function next(self){
  let tail = self.rest();
  return tail.size > 0 ? tail : null;
}

function count(self){
  return self.size;
}

export default effect(
  implement(ISequential, {toArray}),
  implement(IInclusive, {includes}),
  implement(ISet, {union, intersection}),
  implement(ICloneable, {clone: identity}),
  implement(IEmptyableCollection, {empty: constantly(set())}),
  implement(ICollection, {conj}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}))