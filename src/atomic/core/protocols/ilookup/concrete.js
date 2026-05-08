import {ILookup} from "./instance.js";
import {reduce} from "../ireducible/concrete.js";

export function get(self, key, notFound){
  const found = ILookup.lookup(self, key)
  return found == null ? (notFound == null ? null : notFound) : found;
}

export function getIn(self, keys, notFound){
  const found = reduce(get, self, keys);
  return found == null ? (notFound == null ? null : notFound) : found;
}
