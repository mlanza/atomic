import {implement} from '../protocol';
import {does, identity} from '../../core';
import {IFunctor, ISteppable, ICoerceable, IMultipliable, IMap, IAssociative, ILookup, IInclusive} from '../../protocols';
import {reducekv} from '../../protocols/ikvreduce/concrete';
import {add} from '../../protocols/isteppable/concrete';
import {isDate} from "../../types/date/concrete";
import {Duration, duration} from '../duration/construct';
import {mergeWith} from '../../associatives';

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

function adds(self, key, value){
  return IAssociative.assoc(self, key, ILookup.lookup(self, key) + value);
}

function step(self, dt){
  return dt == null ? null : isDate(dt) ? reducekv(adds, dt, self.units) : duration(mergeWith(add, dt.units, self.units));
}

const toDuration = identity;

function keys(self){
  return IMap.keys(self.units);
}

function lookup(self, key){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid duration unit.");
  }
  return ILookup.lookup(self.units, key);
}

function assoc(self, key, value){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid duration unit.");
  }
  return duration(IAssociative.assoc(self.units, key, value));
}

export const behaveAsDuration = does(
  implement(IFunctor, {fmap}),
  implement(IAssociative, {assoc}),
  implement(ILookup, {lookup}),
  implement(IMap, {keys}),
  implement(IMultipliable, {mult}),
  implement(ICoerceable, {toDuration}),
  implement(ISteppable, {step}));