import {implement, does, some, is} from "atomic/core";
import {ICheckable, ISelection} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  return some(is(obj, ?), self.types) ? null : [issue(self)];
}

function options(self){
  return self.types;
}

export default does(
  implement(ISelection, {options}),
  implement(ICheckable, {check}));