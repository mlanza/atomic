import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  try {
    const value = _.invoke(self.f, obj);
    return ICheckable.check(self.constraint, value);
  } catch (ex) {
    return [issue(self.constraint)];
  }
}

export default _.does(
  _.implement(ICheckable, {check}));
