import {implement, does, constantly, conj, maybe, concatenated, map, mapIndexed, compact, blot, toArray} from "atomic/core";
import {ICheckable, IScope} from "../../protocols.js";
import {issue} from "../issue.js";

function check(self, coll){
  return maybe(coll, mapIndexed(function(idx, item){
    return map(IScope.scope(?, idx), ICheckable.check(self.constraint, item));
  }, ?), concatenated, compact, toArray, blot);
}

export const behaveAsCollOf = does(
  implement(ICheckable, {check}));