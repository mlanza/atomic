import * as _ from "atomic/core";

import {Set} from "immutable";

export function set(coll){
  return _.reduce(function(memo, value){
    return memo.add(value);
  }, new Set(), coll || []);;
}

export function emptySet(){
  return new Set();
}
