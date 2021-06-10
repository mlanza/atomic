import {implement, cons, toArray, does} from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue, issues} from "../issue.js";

function check(self, value){
  return issues(ICheckable.check(self.constraint, value), function(iss){
    return issue(self.constraint, toArray(cons(self.key, iss.path)));
  })
}

export const behaveAsScoped = does(
  implement(ICheckable, {check}));