import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable, IScope} from "../../protocols.js";
import {issue, issues} from "../issue.js";
import {and} from "../and/construct.js";
import {required} from "./construct.js";

function check(self, obj){
  const found = _.get(obj, self.key);
  if (_.blank(found)) {
    return [issue(self, [self.key])];
  } else {
    return issues(p.check(self.constraint, found), p.scope(?, self.key));
  }
}

function append(self, constraint){
  return required(self.key, and(self.constraint, constraint));
}

export default _.does(
  _.naming("Required"),
  _.implement(_.IAppendable, {append}),
  _.implement(ICheckable, {check}));
