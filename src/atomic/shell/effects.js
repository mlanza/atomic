import * as _ from "atomic/core";

export function each(f, xs){
  let ys = _.seq(xs);
  while(ys){
    f(_.first(ys));
    ys = _.next(ys);
  }
}

export const eachIndexed = _.withIndex(each);

function doing1(f){
  return doing2(f, _.identity);
}

function doing2(f, order){
  return function(self, ...xs){
    each(f(self, ?), order(xs));
  }
}

export const doing = _.overload(null, doing1, doing2); //mutating counterpart to `reducing`

function dorun1(coll){
  let xs = _.seq(coll);
  while (xs) {
    xs = _.next(xs);
  }
}

function dorun2(n, coll){
  let xs = _.seq(coll);
  while (xs && n > 0) {
    n--;
    xs = _.next(xs);
  }
}

export const dorun = _.overload(null, dorun1, dorun2);

function doall1(coll){
  dorun(coll);
  return coll;
}

function doall2(n, coll){
  dorun(n, coll);
  return coll;
}

export const doall = _.overload(null, doall1, doall2);

export function dotimes(n, f){
  each(f, _.range(n))
}

export function eachkv(f, xs){
  each(function([key, value]){
    return f(key, value);
  }, _.entries(xs));
}

export function eachvk(f, xs){
  each(function([key, value]){
    return f(value, key);
  }, _.entries(xs));
}

function doseq3(f, xs, ys){
  each(function(x){
    each(function(y){
      f(x, y);
    }, ys);
  }, xs);
}

function doseq4(f, xs, ys, zs){
  each(function(x){
    each(function(y){
      each(function(z){
        f(x, y, z);
      }, zs);
    }, ys);
  }, xs);
}

function doseqN(f, xs, ...colls){
  each(function(x){
    if (_.seq(colls)) {
      _.apply(doseq, function(...args){
        _.apply(f, x, args);
      }, colls);
    } else {
      f(x);
    }
  }, xs || []);
}

export const doseq = _.overload(null, null, each, doseq3, doseq4, doseqN);
