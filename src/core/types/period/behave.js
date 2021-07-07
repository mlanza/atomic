import {does, overload} from "../../core.js";
import {implement} from "../protocol.js";
import {emptyable} from "../record/behave.js";
import {duration} from "../duration/construct.js";
import {min, max} from "../number/concrete.js";
import {recurrence} from "../recurrence/construct.js";
import {period} from "./construct.js";
import {map, take} from "../lazy-seq/concrete.js";
import {ISplittable, ICoerceable, IAddable, IBounds, IComparable, IEquiv, IInclusive, IDivisible, IMergable} from "../../protocols.js";
import * as p from "./protocols.js";

function split2(self, step){
  return map(period(?, step), recurrence(p.start(self), p.end(self), step));
}

function split3(self, step, n){
  return take(n, split2(self, step));
}

const split = overload(null, null, split2, split3);

function add(self, dur){
  return p.end(self) ? new self.constructor(p.start(self), self |> p.end |> p.add(?, dur)) : self;
}

function merge(self, other){
  return other == null ? self : new self.constructor(min(p.start(self), p.start(other)), max(p.end(other), p.end(other)));
}

function divide(self, step){
  return p.divide(p.toDuration(self), step);
}

function start(self){
  return self.start;
}

function end(self){
  return self.end;
}

function includes(self, dt) {
  return dt != null && (self.start == null || p.compare(dt, self.start) >= 0) && (self.end == null || p.compare(dt, self.end) < 0);
}

function equiv(self, other){
  return other != null && p.equiv(self.start, other.start) && p.equiv(self.end, other.end);
}

function toDuration(self){
  return self.end == null || self.start == null ? duration(Number.POSITIVE_INFINITY) : duration(self.end - self.start);
}

function compare(self, other){ //TODO test with sort of periods
  return p.compare(other.start, self.start) || p.compare(other.end, self.end);
}

export default does(
  emptyable,
  implement(ISplittable, {split}),
  implement(IAddable, {add}),
  implement(IMergable, {merge}),
  implement(IDivisible, {divide}),
  implement(IComparable, {compare}),
  implement(ICoerceable, {toDuration}),
  implement(IInclusive, {includes}),
  implement(IBounds, {start, end}),
  implement(IEquiv, {equiv}));
