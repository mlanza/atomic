import {overload, identity} from '../../core';
import {protocol} from "../../types/protocol";
import {IReduce} from "../../protocols/ireduce";
import {IKVReduce} from "../../protocols/ikvreduce";
import {ILookup} from "../../protocols/ilookup";
import {IAssociative} from "../../protocols/iassociative";
import {_ as v} from "param.macro";

export function patch(init, x){
  return IKVReduce.reducekv(x, function(memo, key, value){
    return IAssociative.assoc(memo, key, typeof value === "function" ? value(ILookup.lookup(memo, key)) : value);
  }, init);
}

function mergeWith3(xf, init, x){
  return IKVReduce.reducekv(x, function(memo, key, value){
    return IAssociative.assoc(memo, key, IAssociative.contains(memo, key) ? xf(ILookup.lookup(memo, key), value) : xf(value));
  }, init);
}

function mergeWithN(xf, init, ...xs){
  return IReduce.reduce(xs, mergeWith3(v, v, xf), init);
}

export const mergeWith = overload(null, null, null, mergeWith3, mergeWithN);

export const IMergeable = protocol({
  merge: patch
});