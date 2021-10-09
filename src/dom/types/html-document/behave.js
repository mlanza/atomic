import * as _ from "atomic/core";
import ielement from "../element/behave.js";
import Symbol from "symbol";

export default _.does(
  ielement,
  _.naming(?, Symbol("HTMLDocument")),
  _.implement(_.IHierarchy, {closest: _.constantly(null), nextSibling: _.constantly(null), nextSiblings: _.emptyList, prevSibling: _.constantly(null), prevSiblings: _.emptyList, siblings: _.emptyList, parent: _.constantly(null), parents: _.emptyList}));
