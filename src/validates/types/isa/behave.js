import * as _ from "atomic/core";
import {ICheckable, ISelection} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  return _.some(_.is(obj, ?), self.types) ? null : [issue(self)];
}

function options(self){
  return self.types;
}

export default _.does(
  _.keying("Isa"),
  _.implement(ISelection, {options}),
  _.implement(ICheckable, {check}));
