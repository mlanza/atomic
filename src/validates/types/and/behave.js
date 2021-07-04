import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {and} from "./construct.js";
import {issue, issues} from "../issue.js";

function check(self, value){
  return issues(self.constraints, ICheckable.check(?, value));
}

function conj(self, constraint){
  return _.apply(and, _.conj(self.constraints, constraint));
}

function first(self){
  return _.first(self.constraints);
}

function rest(self){
  return _.rest(self.constraints);
}

function empty(self){
  return and();
}

function seq(self){
  return _.seq(self.constraints) ? self : null;
}

function next(self){
  return _.seq(rest(self));
}

export default _.does(
  _.implement(_.ISeqable, {seq}),
  _.implement(_.INext, {next}),
  _.implement(_.IEmptyableCollection, {empty}),
  _.implement(_.ICollection, {conj}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.IAppendable, {append: conj}),
  _.implement(ICheckable, {check}));
