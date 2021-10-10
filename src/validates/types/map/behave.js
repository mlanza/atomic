import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, obj){
  try {
    const value = _.invoke(self.f, obj);
    return p.check(self.constraint, value);
  } catch (ex) {
    return [issue(self.constraint)];
  }
}

export default _.does(
  _.naming("Map"),
  _.implement(ICheckable, {check}));
