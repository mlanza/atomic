import {implement, does, includes} from "atomic/core";
import {ICheckable, ISelection} from "../../protocols.js";
import {issue} from "../issue.js";

function options(self){
  return self.options;
}

function check(self, value){
  return includes(self.options, value) ? null : [issue(self)];
}

export default does(
  implement(ISelection, {options}),
  implement(ICheckable, {check}));