import {overload, identity} from '../../core';
import {protocol} from "../../types/protocol";
import {IReduce} from "../../protocols/ireduce";
import {IKVReduce} from "../../protocols/ikvreduce";
import {ILookup} from "../../protocols/ilookup";
import {IAssociative} from "../../protocols/iassociative";
import {_ as v} from "param.macro";

function patch2(self, other){
  return other ? IKVReduce.reducekv(other, function(memo, key, value){
    return IAssociative.assoc(memo, key, typeof value === "function" ? value(ILookup.lookup(memo, key)) : value);
  }, self) : self;
}

function patch3(self, other, xf){
  return other ? IKVReduce.reducekv(other, function(memo, key, value){
    const was = ILookup.lookup(memo, key);
    return IAssociative.assoc(memo, key, was == null ? xf(value) : xf(was, value));
  }, self) : self;
}

export const patch = overload(null, identity, patch2, patch3);

export function mergeWith(xf, init, ...xs){
  return IReduce.reduce(xs, patch3(v, v, xf), init);
}

export const IMergeable = protocol({
  merge: patch2
});