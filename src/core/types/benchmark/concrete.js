import {overload} from "../../core.js";
import {mapa, sort, asc} from "../lazy-seq/concrete.js";
import {benchmark} from "./construct.js";
import {ISeq, INext} from "../../protocols.js";
import Promise from "promise";

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