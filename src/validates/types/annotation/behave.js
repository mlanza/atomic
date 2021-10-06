import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ICheckable, IExplains} from "../../protocols.js";
import {issue, issues} from "../issue.js";
import {anno} from "./construct.js";
import Symbol from "symbol";

function deref(self){
  return self.constraint;
}

function explain(self){
  return self.note;
}

function check(self, value){
  return issues(p.check(self.constraint, value), function(iss){
    return issue(anno(self.note, iss.constraint), iss.path);
  });
}

function append(self, constraint){
  return anno(self.note, _.append(self.constraint, constraint));
}

export default _.does(
  _.naming(?, Symbol("Annotation")),
  _.implement(_.IDeref, {deref}),
  _.implement(IExplains, {explain}),
  _.implement(_.IAppendable, {append}),
  _.implement(ICheckable, {check}));
