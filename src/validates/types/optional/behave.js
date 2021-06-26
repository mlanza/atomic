import {implement, get, blank, does, IAppendable} from "atomic/core";
import {ICheckable, IScope} from "../../protocols.js";
import {issue, issues} from "../issue.js";
import {and} from "../and/construct.js";
import {optional} from "./construct.js";

function check(self, obj){
  const found = get(obj, self.key);
  if (blank(found)) {
    return null;
  } else {
    return issues(ICheckable.check(self.constraint, found), IScope.scope(?, self.key));
  }
}

function append(self, constraint){
  return optional(self.key, and(self.constraint, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));