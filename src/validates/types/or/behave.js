import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable} from "../../protocols.js";
import {or} from "./construct.js";
import Symbol from "symbol";

function check(self, value){
  return _.detect(_.isSome, _.map(p.check(?, value), self.constraints));
}

function conj(self, constraint){
  return _.apply(or, _.conj(self.constraints, constraint));
}

function first(self){
  return _.first(self.constraints);
}

function rest(self){
  return _.rest(self.constraints);
}

function empty(self){
  return or();
}

function seq(self){
  return _.seq(self.constraints) ? self : null;
}

function next(self){
  return _.seq(rest(self));
}

export default _.does(
  _.naming(?, Symbol("Or")),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.INext, {next}),
  _.implement(_.IEmptyableCollection, {empty}),
  _.implement(_.ICollection, {conj}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.IAppendable, {append: conj}),
  _.implement(ICheckable, {check}));
