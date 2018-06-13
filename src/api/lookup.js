import {ILookup} from "../protocols/ilookup";
import {IReduce} from "../protocols/ireduce";

export function get(self, key, notFound){
  return ILookup.lookup(self, key) || notFound;
}

export function getIn(self, keys, notFound){
  return IReduce.reduce(keys, get, self) || notFound;
}