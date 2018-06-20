import {overload} from '../../core';
import {mapa, sort, asc} from '../lazyseq/concrete';
import {benchmark} from './construct';
import Promise from '../promise/construct';
import {ISeq, INext} from '../../protocols';

function race1(operations){
  return race2(10, operations);
}

function race2(n, operations){
  return race3(n, operations, []).then(function(measures){
    return sort(asc(average), asc(most), measures);
  });
}

function race3(n, operations, measures){
  return Promise.all([measures, benchmark(n, ISeq.first(operations))]).then(function([xs, x]){
    const measures = xs.concat(x);
    return INext.next(operations) ? race3(n, INext.next(operations), measures) : measures;
  })
}

export const race = overload(null, race1, race2, race3);

function duration(x){
  return x.duration;
}

function average(x){
  return x.average;
}

function most(x){
  return x.most;
}