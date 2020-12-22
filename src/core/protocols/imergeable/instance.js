import {overload, identity} from '../../core';
import {protocol} from "../../types/protocol";
import {IReduce} from "../../protocols/ireduce";
import {IKVReduce} from "../../protocols/ikvreduce";
import {ILookup} from "../../protocols/ilookup";
import {IAssociative} from "../../protocols/iassociative";

function merge(target, source){
  return IKVReduce.reducekv(source, IAssociative.assoc, target);
}

function mergeWith3(xf, init, x){
  return IKVReduce.reducekv(x, function(memo, key, value){
    return IAssociative.assoc(memo, key, IAssociative.contains(memo, key) ? xf(ILookup.lookup(memo, key), value) : xf(value));
  }, init);
}

function mergeWithN(xf, init, ...xs){
  return IReduce.reduce(xs, mergeWith3(xf, ?, ?), init);
}

export const mergeWith = overload(null, null, null, mergeWith3, mergeWithN);

export const IMergeable = protocol({
  merge
});