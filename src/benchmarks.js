import {overload, identity, milliseconds, mapa, partial, range, pipe, chain, juxtm, average, most, least, sort, asc} from "./core";
import {IArray, IAssociative, ICounted, IDeref, IEmptyableCollection, IKVReduce, IMapEntry, IReduce, ISeqable} from "./core/protocols";

function time1(f){
  return time2(chain, f);
}

function time2(chain, f){
  const start = Date.now();
  return chain(f(), function(){
    const end = Date.now();
    return milliseconds(end - start);
  });
}

function time3(chain, f, n){
  return chain(mapa(function(){
    return time2(chain, f);
  }, range(n)), partial(mapa, IDeref.deref), function(results){
    return juxtm(results, {
      count: ICounted.count,
      average: pipe(average, milliseconds),
      most: pipe(most, milliseconds),
      least: pipe(least, milliseconds)
    });
  });
}

export const time = overload(null, time1, time2, time3);

function benchmark4(chain, fs, n, by){
  return sort(asc(function(pair){
    return by(IMapEntry.val(pair));
  }), IArray.toArray(ISeqable.seq(IKVReduce.reducekv(fs, function(memo, key, f){
    return IAssociative.assoc(memo, key, time(chain, f, n));
  }, IEmptyableCollection.empty(fs)))));
}

function benchmark3(chain, fs, n){
  return benchmark4(chain, fs, n, function(result){
    return result.average.milliseconds;
  });
}

function benchmark2(fs, n){
  return benchmark3(chain, fs, n);
}

function benchmark1(fs){
  return benchmark3(chain, fs, 50);
}

export const benchmark = overload(null, benchmark1, benchmark2, benchmark3, benchmark4);