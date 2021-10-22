import {overload, identity} from "../../core.js";
import {IReduce} from "./instance.js";
import {ISeq} from "../iseq/instance.js";

function reduce2(f, coll){
  return reduce3(f, ISeq.first(coll), ISeq.rest(coll));
}

function reduce3(f, init, coll){
  return IReduce.reduce(coll, f, init);
}

export const reduce = overload(null, null, reduce2, reduce3);

function reducing1(f){
  return reducing2(f, identity);
}

function reducing2(f, order){
  return function(x, ...xs){
    return reduce3(f, x, order(xs));
  }
}

export const reducing = overload(null, reducing1, reducing2);
