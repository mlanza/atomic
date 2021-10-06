import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";
import Symbol from "symbol";

function check(self, obj){
  const pos = _.indexOf(self.args, null),
        args = _.assoc(self.args, pos, obj);
  return _.apply(self.f, args) ? null : [issue(self)];
}

export default _.does(
  _.naming(?, Symbol("Predicate")),
  _.implement(ICheckable, {check}));
