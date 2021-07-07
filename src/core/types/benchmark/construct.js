import {overload, partial} from "../../core.js";
import {period} from "../period/construct.js";
import {mapa, sort, asc} from "../lazy-seq/concrete.js";
import {measure} from "../number/concrete.js";
import Promise from "promise";
import * as p from "./protocols.js";

export function Benchmark(operation, result, period, duration){
  this.operation = operation;
  this.result = result;
  this.period = period;
  this.duration = duration;
}

function benchmark1(operation){
  const start = new Date();
  return Promise.resolve(operation()).then(function(result){
    const end = new Date();
    return new Benchmark(operation, result, period(start, end), end - start);
  });
}

function benchmark2(n, operation){
  return benchmark3(n, operation, []).then(function(xs){
    return sort(asc(duration), xs);
  }).then(function(xs){
    return Object.assign({
      source: xs,
      operation: p.first(xs).operation
    }, measure(mapa(duration, xs)));
  });
}

function benchmark3(n, operation, benchmarked){
  return n ? benchmark1(operation).then(function(bm){
    return benchmark3(n - 1, operation, benchmarked.concat(bm));
  }) : benchmarked;
}

export const benchmark = overload(null, benchmark1, benchmark2);

function duration(x){
  return x.duration;
}
