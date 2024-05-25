import {overload} from "../../core.js";
import {pluck} from "../lazy-seq/concrete.js";
import {repeatedly} from "../lazy-seq.js";
import {partial} from "../../core.js";
import {nth} from "../../protocols/iindexed/concrete.js";
import {count} from "../../protocols/icounted/concrete.js";
import {join} from "../lazy-seq.js";

export function uident(len, random = Math.random){
  return join("", repeatedly(len, partial(pluck, random, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")));
}

export function UID(id, context){
  this.id = id;
  this.context = context; //optionally, the qualifying context in which the id is unique
}

UID.prototype[Symbol.toStringTag] = "UID";
UID.prototype.toString = function(){
  return this.id;
}

export function uids(len, random = Math.random){
  function uid0() {
    return uid2(uident(len, random));
  }

  function uid2(id, context = null){
    return new UID(id, context);
  }

  return overload(uid0, uid2, uid2);
}

export const uid = uids(5);
