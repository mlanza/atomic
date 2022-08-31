import {overload} from "../../core.js";
import {randInt} from "../number.js";
import {repeatedly} from "../lazy-seq.js";
import {partial} from "../../core.js";
import {nth} from "../../protocols/iindexed/concrete.js";
import {count} from "../../protocols/icounted/concrete.js";
import {join} from "../lazy-seq.js";

export function pluck(coll){
  return nth(coll, randInt(count(coll)));
}

export function uident(len){
  return join("", repeatedly(len, partial(pluck, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")));
}

export function UID(id, context){
  this.id = id;
  this.context = context; //optionally, the qualifying context in which the id is unique
}

UID.prototype[Symbol.toStringTag] = "UID";
UID.prototype.toString = function(){
  return this.id;
}

function uid0() {
  return uid(uident(5));
}

function uid2(id, context = null){
  return new UID(id, context);
}

export const uid = overload(uid0, uid2, uid2);
