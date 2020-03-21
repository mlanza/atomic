import {does} from '../../core';
import {implement} from '../protocol';
import {emptyable} from "../record/behave";
import {recurrence} from "../recurrence/construct";
import {period} from "./construct";
import {map} from "../lazy-seq/concrete";
import {duration} from "../duration/construct";
import {ICoerceable, IBounds, IComparable, IEquiv, IInclusive, IDivisible} from '../../protocols';
import {_ as v} from "param.macro";

function divide(self, step){
  return map(period(v, step), recurrence(IBounds.start(self), IBounds.end(self), step));
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
  implement(IDivisible, {divide}),
  implement(IComparable, {compare}),
  implement(ICoerceable, {toDuration}),
  implement(IInclusive, {includes}),
  implement(IBounds, {start, end}),
  implement(IEquiv, {equiv}));