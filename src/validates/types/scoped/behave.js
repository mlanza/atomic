import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue, issues} from "../issue.js";

function check(self, value){
  return issues(ICheckable.check(self.constraint, value), function(iss){
    return issue(self.constraint, _.toArray(_.cons(self.key, iss.path)));
  })
}

export default _.does(
  _.implement(ICheckable, {check}));
