import * as _ from "atomic/core";
import {IScope} from "../../protocols.js";
import {issue} from "./construct.js";

function deref(self){
  return self.constraint;
}

function scope(self, key) {
  return issue(self.constraint, _.toArray(_.cons(key, self.path)));
}

function at(self, path){
  return issue(self.constraint, path);
}

export default _.does(
  _.implement(_.IDeref, {deref}),
  _.implement(IScope, {scope, at}));
