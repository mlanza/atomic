import {implement, does, invoke} from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  try {
    const value = invoke(self.f, obj);
    return ICheckable.check(self.constraint, value);
  } catch (ex) {
    return [issue(self.constraint)];
  }
}

export default does(
  implement(ICheckable, {check}));