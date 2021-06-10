import {implement, does, isInteger, between, count, IBounds, IInclusive} from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function start(self){
  return self.start;
}

function end(self){
  return self.end;
}

function includes(self, value){
  return between(self, value);
}

function check(self, obj){
  const value = self.f(obj);
  return (self.start != null && value <= self.start) || (self.end != null && value >= self.end) ? [issue(self)] : null;
}

export const behaveAsBounds = does(
  implement(ICheckable, {check}),
  implement(IInclusive, {includes}),
  implement(IBounds, {start, end}));