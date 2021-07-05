import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable} from "../../protocols.js";

function check(self, obj){
  return self.pred(obj) ? p.check(self.constraint, obj) : null;
}

export default _.does(
  _.implement(ICheckable, {check}));
