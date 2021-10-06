import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";
import Symbol from "symbol";

function start(self){
  return self.least;
}

function end(self){
  return self.most;
}

function includes(self, value){
  return _.isInteger(value) && _.between(self, value);
}

function check(self, coll){
  const n = _.count(coll);
  return n < self.least || n > self.most ? [issue(self)] : null;
}

export default _.does(
  _.naming(?, Symbol("Card")),
  _.implement(ICheckable, {check}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IBounds, {start, end}));
