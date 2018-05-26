import {overload, identity} from "../../core";
import {reducing} from "../../types/reduced";
import {set} from "../../types/set/construct";
import * as p from "../../protocols";

export const union = overload(set, identity, p.union, reducing(p.union));
export const intersection = overload(null, null, p.intersection, reducing(p.intersection));
export const difference = overload(null, null, p.difference, reducing(p.difference));
export function subset(subset, superset){
  return p.superset(superset, subset);
}