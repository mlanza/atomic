import {overload, identity} from "./core";
import {IArr, IAssociative, ICounted, IDeref, IEmptyableCollection, IKVReduce, IMapEntry, IReduce, ISeqable} from "./protocols";
import * as T from "./types";

function time1(f){
  return time2(T.chain, f);
}

function time2(chain, f){
  const start = Date.now();
  return chain(f(), function(){
    const end = Date.now();
    return T.milliseconds(end - start);
  });
}

function time3(chain, f, n){
  return chain(T.mapa(function(){
    return time2(chain, f);
  }, T.range(n)), T.partial(T.mapa, IDeref.deref), function(results){
    return T.juxtm(results, {
      count: ICounted.count,
      average: T.pipe(T.average, T.milliseconds),
      most: T.pipe(T.most, T.milliseconds),
      least: T.pipe(T.least, T.milliseconds)
    });
  });
}

export const time = overload(null, time1, time2, time3);

function race4(chain, fs, n, by){
  return T.sort(T.asc(function(pair){
    return by(IMapEntry.val(pair));
  }), IArr.toArray(ISeqable.seq(IKVReduce.reducekv(fs, function(memo, key, f){
    return IAssociative.assoc(memo, key, time(chain, f, n));
  }, IEmptyableCollection.empty(fs)))));
}

function race3(chain, fs, n){
  return race4(chain, fs, n, function(result){
    return result.average.milliseconds;
  });
}

function race2(fs, n){
  return race3(T.chain, fs, n);
}

function race1(fs){
  return race3(T.chain, fs, 50);
}

export const race = overload(null, race1, race2, race3, race4);