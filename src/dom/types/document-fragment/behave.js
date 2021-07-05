import * as _ from "atomic/core";
import ielement from "../element/behave.js";

export default _.does(
  ielement,
  _.implement(_.IHierarchy, {nextSibling: _.constantly(null), nextSiblings: _.emptyList, prevSibling: _.constantly(null), prevSiblings: _.emptyList, siblings: _.emptyList, parent: _.constantly(null), parents: _.emptyList}),
  _.implement(_.INext, {next: _.constantly(null)}),
  _.implement(_.ISeq, {first: _.identity, rest: _.emptyList}),
  _.implement(_.ISeqable, {seq: _.cons}));
