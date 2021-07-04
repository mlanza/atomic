import * as _ from "atomic/core";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  const pos = _.indexOf(self.args, null),
        args = _.assoc(self.args, pos, obj);
  return _.apply(self.f, args) ? null : [issue(self)];
}

export default _.does(
  _.implement(ICheckable, {check}));
