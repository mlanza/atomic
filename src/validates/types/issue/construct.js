import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import Promise from "promise";
import Symbol from "symbol";

export function Issue(constraint, path){
  this.constraint = constraint;
  this.path = path;
}

Issue.prototype[Symbol.toStringTag] = "Issue";

export function issue(constraint, path){
  return new Issue(constraint, path || null);
}

function issues1(obj){
  return _.seq(p.check(p.constraints(obj), obj));
}

function issues2(xs, f) {
  if (xs == null) {
    return null;
  } else if (_.isPromise(xs)) {
    return _.fmap(xs, function(x){
      return issues2(x, f);
    });
  } else if (_.satisfies(_.ISeqable, xs)) {
    return xs |> _.seq |> _.map(f, ?) |> _.flatten |> _.compact |> _.blot;
  }
}

export const issues = _.overload(null, issues1, issues2);

function issuing2(x, issue){
  return issuing3(x, _.identity, issue);
}

function issuing3(x, valid, issue){
  if (_.isPromise(x)) {
    return _.fmap(x, valid, issuing(?, valid, issue));
  } else if (valid(x)) {
    return null;
  } else {
    return [issue]
  }
}

export const issuing = _.overload(null, null, issuing2, issuing3);
