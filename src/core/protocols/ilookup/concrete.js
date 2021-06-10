import {ILookup} from "./instance.js";
import {IReduce} from "../ireduce.js";

export function get(self, key, notFound){
  const found = ILookup.lookup(self, key)
  return found == null ? (notFound == null ? null : notFound) : found;
}

export function getIn(self, keys, notFound){
  const found = IReduce.reduce(keys, get, self);
  return found == null ? (notFound == null ? null : notFound) : found;
}