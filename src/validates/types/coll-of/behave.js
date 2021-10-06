import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable, IScope} from "../../protocols.js";
import {issue} from "../issue.js";
import Symbol from "symbol";

function check(self, coll){
  return _.maybe(coll, _.mapIndexed(function(idx, item){
    return _.map(p.scope(?, idx), p.check(self.constraint, item));
  }, ?), _.concatenated, _.compact, _.toArray, _.blot);
}

export default _.does(
  _.naming(?, Symbol("CollOf")),
  _.implement(ICheckable, {check}));
