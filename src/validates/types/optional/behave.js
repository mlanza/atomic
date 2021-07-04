import * as _ from "atomic/core";
import {ICheckable, IScope} from "../../protocols.js";
import {issue, issues} from "../issue.js";
import {and} from "../and/construct.js";
import {optional} from "./construct.js";

function check(self, obj){
  const found = _.get(obj, self.key);
  if (_.blank(found)) {
    return null;
  } else {
    return issues(ICheckable.check(self.constraint, found), IScope.scope(?, self.key));
  }
}

function append(self, constraint){
  return optional(self.key, and(self.constraint, constraint));
}

export default _.does(
  _.implement(_.IAppendable, {append}),
  _.implement(ICheckable, {check}));
