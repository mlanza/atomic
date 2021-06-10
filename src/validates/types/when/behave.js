import {implement, does} from "atomic/core";
import {ICheckable} from "../../protocols.js";

function check(self, obj){
  return self.pred(obj) ? ICheckable.check(self.constraint, obj) : null;
}

export const behaveAsWhen = does(
  implement(ICheckable, {check}));