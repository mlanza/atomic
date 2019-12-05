import {does, identity, overload, doto} from '../../core';
import {cons} from "../list/construct";
import {implement, satisfies} from '../protocol';
import {IFunctor, ISeq, INext, ISequential, ICoerceable, IDeref} from '../../protocols';
import {mapcat} from '../lazy-seq';
import {per, emptyPer} from "./construct";
import {behaveAsSeries} from "../series/behave";

function fmap(self, f){
  return per(mapcat(function(x){
    const y = f(x);
    return y == null ? [] : satisfies(ISequential, y) ? y : cons(y);
  }, self.items));
}

function first(self){
  return ISeq.first(self.items);
}

function rest(self){
  const result = next(self);
  return result ? per(result) : emptyPer();
}

function next(self){
  const result = INext.next(self.items);
  return result ? per(result) : null;
}

const deref = Array.from;
const toArray = Array.from;

export const behaveAsPer = does(
  behaveAsSeries,
  implement(IDeref, {deref}),
  implement(ICoerceable, {toArray}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IFunctor, {fmap}));