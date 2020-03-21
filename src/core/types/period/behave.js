import {does, overload} from '../../core';
import {implement} from '../protocol';
import {emptyable} from "../record/behave";
import {duration} from "../duration/construct";
import {min, max} from "../number/concrete";
import {recurrence} from "../recurrence/construct";
import {period} from "./construct";
import {map, take} from "../lazy-seq/concrete";
import {ISplittable, ICoerceable, IAddable, IBounds, IComparable, IEquiv, IInclusive, IDivisible, IMergeable} from '../../protocols';
import {_ as v} from "param.macro";

function split2(self, step){
  return map(period(v, step), recurrence(IBounds.start(self), IBounds.end(self), step));
}

function split3(self, step, n){
  return take(n, split2(self, step));
}

const split = overload(null, null, split2, split3);

function add(self, dur){
  return IBounds.end(self) ? new self.constructor(IBounds.start(self), self |> IBounds.end |> IAddable.add(v, dur)) : self;
}

function merge(self, other){
  return other == null ? self : new self.constructor(min(IBounds.start(self), IBounds.start(other)), max(IBounds.end(other), IBounds.end(other)));
}

function divide(self, step){
  return IDivisible.divide(ICoerceable.toDuration(self), step);
}

function start(self){
  return self.start;
}

function end(self){
  return self.end;
}

function includes(self, dt) {
  return dt != null && (self.start == null || IComparable.compare(dt, self.start) >= 0) && (self.end == null || IComparable.compare(dt, self.end) < 0);
}

function equiv(self, other){
  return other != null && IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end);
}

function toDuration(self){
  return self.end == null || self.start == null ? duration(Number.POSITIVE_INFINITY) : duration(self.end - self.start);
}

function compare(self, other){ //TODO test with sort of periods
  return IComparable.compare(other.start, self.start) || IComparable.compare(other.end, self.end);
}

export const behaveAsPeriod = does(
  emptyable,
  implement(ISplittable, {split}),
  implement(IAddable, {add}),
  implement(IMergeable, {merge}),
  implement(IDivisible, {divide}),
  implement(IComparable, {compare}),
  implement(ICoerceable, {toDuration}),
  implement(IInclusive, {includes}),
  implement(IBounds, {start, end}),
  implement(IEquiv, {equiv}));