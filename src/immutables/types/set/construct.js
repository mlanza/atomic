import * as _ from "atomic/core";

import {Set} from "immutable";

export function set(coll){
  return coll instanceof Set ? coll : new Set(_.toArray(coll));
}

export function emptySet(){
  return new Set();
}
