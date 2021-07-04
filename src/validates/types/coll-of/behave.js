import * as _ from "atomic/core";
import {ICheckable, IScope} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, coll){
  return _.maybe(coll, _.mapIndexed(function(idx, item){
    return _.map(IScope.scope(?, idx), ICheckable.check(self.constraint, item));
  }, ?), _.concatenated, _.compact, _.toArray, _.blot);
}

export default _.does(
  _.implement(ICheckable, {check}));
