import {identity} from "../core";
import {IReduce, ISeqable, IAssociative} from "../protocols";
import {some} from "../types/lazy-seq/concrete";
import {update} from "../protocols/iassociative/concrete";

export default function mergeWith(f, init, ...maps){
  return init && some(identity, maps) ? IReduce.reduce(maps, function(memo, map){
    return IReduce.reduce(ISeqable.seq(map), function(memo, [key, value]){
      return IAssociative.contains(memo, key) ? update(memo, key, function(prior){
        return f(prior, value);
      }) : IAssociative.assoc(memo, key, value);
    }, memo);
  }, init) : null;
}

export {mergeWith};