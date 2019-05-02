import {overload, identity, fmap, map, blot, compact, flatten, toArray, satisfies, isPromise, Promise, detect, ISeq} from 'cloe/core';
import {_ as v} from "param.macro";

export default function Issue(constraint, path){
  this.constraint = constraint;
  this.path = path;
}

export function issue(constraint, path){
  return new Issue(constraint, path || null);
}

export {Issue}

export function issues(xs, f) {
  if (xs == null) {
    return null;
  } else if (isPromise(xs)) {
    return fmap(xs, function(x){
      return issues(x, f);
    });
  } else if (satisfies(ISeq, xs)) {
    return map(f, xs) |> flatten |> compact |> blot;
  }
}

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