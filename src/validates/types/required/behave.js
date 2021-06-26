import {implement, get, blank, does, contains, IAppendable} from "atomic/core";
import {ICheckable, IScope} from "../../protocols.js";
import {issue, issues} from "../issue.js";
import {and} from "../and/construct.js";
import {required} from "./construct.js";

function check(self, obj){
  const found = get(obj, self.key);
  if (blank(found)) {
    return [issue(self, [self.key])];
  } else {
    return issues(ICheckable.check(self.constraint, found), IScope.scope(?, self.key));
  }
}

function append(self, constraint){
  return required(self.key, and(self.constraint, constraint));
}

export default does(
  implement(IAppendable, {append}),
  implement(ICheckable, {check}));