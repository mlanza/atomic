import {overload, identity, fmap, map, blot, compact, flatten, toArray, satisfies, isPromise, Promise, detect, seq, ISeq} from 'atomic/core';
import {ICheckable} from "../../protocols/icheckable/instance";
import {IConstrained} from "../../protocols/iconstrained/instance";
import {_ as v} from "param.macro";

export function Issue(constraint, path){
  this.constraint = constraint;
  this.path = path;
}

export function issue(constraint, path){
  return new Issue(constraint, path || null);
}

function issues1(obj){
  return seq(ICheckable.check(IConstrained.constraints(obj), obj));
}

function issues2(xs, f) {
  if (xs == null) {
    return null;
  } else if (isPromise(xs)) {
    return fmap(xs, function(x){
      return issues2(x, f);
    });
  } else if (satisfies(ISeq, xs)) {
    return map(f, xs) |> flatten |> compact |> blot;
  }
}

export const issues = overload(null, issues1, issues2);

function issuing2(x, issue){
  return issuing3(x, identity, issue);
}

function issuing3(x, valid, issue){
  if (isPromise(x)) {
    return fmap(x, valid, issuing(v, valid, issue));
  } else if (valid(x)) {
    return null;
  } else {
    return [issue]
  }
}

export const issuing = overload(null, null, issuing2, issuing3);