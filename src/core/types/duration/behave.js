import {implement} from '../protocol';
import {does, identity} from '../../core';
import {IFunctor, IMergeable, ISteppable, ICoerceable, IMultipliable, IMap, IAssociative, ILookup, IInclusive} from '../../protocols';
import {reducekv} from '../../protocols/ikvreduce/concrete';
import {add} from '../../protocols/isteppable/concrete';
import {isDate} from "../../types/date/concrete";
import {Duration, duration} from '../duration/construct';
import {mergeWith} from '../../associatives';

function adds(self, key, value){
  return IAssociative.assoc(self, key, ILookup.lookup(self, key) + value);
}

function step(self, dt){
  return isDate(dt) ? reducekv(adds, dt, self.units) : IMergeable.merge(self, dt);
}

function merge(self, other){
  return other ? duration(mergeWith(add, self.units, other.units)) : self;
}

function mult(self, n){
  return IFunctor.fmap(self, function(value){
    return value * n;
  });
}

function fmap(self, f){
  return new self.constructor(reducekv(function(memo, key, value){
    return IAssociative.assoc(memo, key, f(value));
  }, {}, self.units));
}

const toDuration = identity;

function keys(self){
  return IMap.keys(self.units);
}

function dissoc(self, key){
  return duration(IMap.dissoc(self.units, key));
}

function lookup(self, key){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return ILookup.lookup(self.units, key);
}

function assoc(self, key, value){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return duration(IAssociative.assoc(self.units, key, value));
}

export const behaveAsDuration = does(
  implement(IMergeable, {merge}),
  implement(IFunctor, {fmap}),
  implement(IAssociative, {assoc}),
  implement(ILookup, {lookup}),
  implement(IMap, {keys, dissoc}),
  implement(IMultipliable, {mult}),
  implement(ICoerceable, {toDuration}),
  implement(ISteppable, {step}));