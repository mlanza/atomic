import * as _ from "atomic/core";
import {ICheckable, ISelection} from "../../protocols.js";
import {issue} from "../issue.js";
import Symbol from "symbol";

function options(self){
  return self.options;
}

function check(self, value){
  return _.includes(self.options, value) ? null : [issue(self)];
}

export default _.does(
  _.naming(?, Symbol("Choice")),
  _.implement(ISelection, {options}),
  _.implement(ICheckable, {check}));
