import {implement, does} from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  try {
    return ICheckable.check(self.constraint, obj);
  } catch (ex) {
    return [issue(self)];
  }
}

export const behaveAsCatches = does(
  implement(ICheckable, {check}));