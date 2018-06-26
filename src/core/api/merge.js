import {identity} from "../core";
import {IReduce, ISeqable} from "../protocols";
import {some} from "../types/lazy-seq/concrete";

export default function merge(...maps){
  return some(identity, maps) ? IReduce.reduce(maps, function(memo, map){
    return IReduce.reduce(ISeqable.seq(map), function(memo, [key, value]){
      memo[key] = value;
      return memo;
    }, memo);
  }, {}) : null;
}

export {merge};