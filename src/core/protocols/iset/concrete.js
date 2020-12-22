import {overload, identity} from "../../core";
import {reduce, reducing} from "../ireduce/concrete";
import {conj} from "../icollection/concrete";
import {includes} from "../iinclusive/concrete";
import {empty} from "../iemptyablecollection/concrete"
import {concat} from "../../types/concatenated/construct";
import {every} from "../../types/lazy-seq/concrete";
import {ISet} from "./instance";

export const disj = overload(null, identity, ISet.disj, reducing(ISet.disj));

const union2 = reduce(ISet.unite, ?, ?);

function intersection2(xs, ys){
  return reduce(function(memo, x){
    return includes(ys, x) ? conj(memo, x) : memo;
  }, empty(xs), xs);
}

function difference2(xs, ys){
  return reduce(function(memo, x){
    return includes(ys, x) ? memo : conj(memo, x);
  }, empty(xs), xs);
}

export function subset(self, other){
  return every(includes(other, ?), self);
}

export function superset(self, other){
  return subset(other, self);
}

export const unite = overload(null, null, ISet.unite, reducing(ISet.unite));
export const union = overload(null, identity, union2, reducing(union2));
export const intersection = overload(null, null, intersection2, reducing(intersection2));
export const difference = overload(null, null, difference2, reducing(difference2));