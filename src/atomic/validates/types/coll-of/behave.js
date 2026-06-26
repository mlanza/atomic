import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable, IScope} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, coll){
  return _.maybe(coll, _.mapIndexed(function(idx, item){
    return _.map(x => p.scope(x, idx), p.check(self.constraint, item));
  }, coll), _.concatenated, _.compact, _.toArray, _.blot);
}

export default _.does(
  _.keying("CollOf"),
  _.implement(ICheckable, {check}));
