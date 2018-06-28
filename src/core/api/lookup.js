import {ILookup} from "../protocols/ilookup";
import {IReduce} from "../protocols/ireduce";

export function get(self, key, notFound){
  const found = ILookup.lookup(self, key)
  return found == null ? notFound : found;
}

export function getIn(self, keys, notFound){
  const found = IReduce.reduce(keys, get, self);
  return found == null ? notFound : found;
}