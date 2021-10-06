import * as _ from "atomic/core";
import {ICheckable, ISelection} from "../../protocols.js";
import {issue} from "../issue.js";
import Symbol from "symbol";

function check(self, obj){
  return _.some(_.is(obj, ?), self.types) ? null : [issue(self)];
}

function options(self){
  return self.types;
}

export default _.does(
  _.naming(?, Symbol("Isa")),
  _.implement(ISelection, {options}),
  _.implement(ICheckable, {check}));
