import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  try {
    return p.check(self.constraint, obj);
  } catch (ex) {
    return [issue(self)];
  }
}

export default _.does(
  _.implement(ICheckable, {check}));
