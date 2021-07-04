import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";

function check(self, obj){
  return self.pred(obj) ? ICheckable.check(self.constraint, obj) : null;
}

export default _.does(
  _.implement(ICheckable, {check}));
