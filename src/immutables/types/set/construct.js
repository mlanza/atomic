import * as _ from "atomic/core";

import {Set} from "immutable";

export function set(coll){
  return coll ? new Set(_.toArray(coll)) : new Set();
}

export function emptySet(){
  return new Set();
}
