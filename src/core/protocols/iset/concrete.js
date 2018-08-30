import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
import {set} from "../../types/set/construct";
import ISet from "./instance";

export const superset = ISet.superset;
export const disj = ISet.disj;
export const union = overload(set, identity, ISet.union, reducing(ISet.union));
export const intersection = overload(null, null, ISet.intersection, reducing(ISet.intersection));
export const difference = overload(null, null, ISet.difference, reducing(ISet.difference));

export function subset(subset, superset){
  return ISet.superset(superset, subset);
}