import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function start(self){
  return self.start;
}

function end(self){
  return self.end;
}

function includes(self, value){
  return _.between(self, value);
}

function check(self, obj){
  const value = self.f(obj);
  return (self.start != null && value <= self.start) || (self.end != null && value >= self.end) ? [issue(self)] : null;
}

export default _.does(
  _.keying("Bounds"),
  _.implement(ICheckable, {check}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IBounds, {start, end}));
