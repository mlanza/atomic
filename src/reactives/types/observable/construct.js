import {pub, err, complete, sub} from "../../protocols/concrete.js";
import {IReduce, comp, each, identity, overload, unreduced, isReduced} from "atomic/core";
import {subject} from "../subject/construct.js";
import {observe} from "../observer/construct.js";
import {ISubscribe} from "../../protocols/isubscribe.js";

export function Observable(subscribed){
  this.subscribed = subscribed;
}

export function observable(subscribed){
  return new Observable(subscribed);
}

export function pipe(source, xf, ...xfs){
  const xform = xfs.length ? comp(xf, ...xfs) : xf,
        step = xform(pub);
  return observable(function(observer){
    return sub(source, observe(function(value){
      let memo = step(observer, value);
      if (isReduced(memo)){
        complete(unreduced(memo));
      }
      return memo;
    }, observer));
  });
}

function from(coll){
  return observable(function(observer){
    each(pub(observer, ?), coll);
    complete(observer);
  });
}

function fromPromise(promise){
  return observable(function(observer){
    promise.then(function(value){
      pub(observer, val);
      complete(observer);
    }).catch(function(error){
      err(observer, error);
      complete(observer);
    });
  });
}

export function fromEvent(el, key) {
  return observable(function(observer){
    const handler = pub(observer, ?);
    el.addEventListener(key, handler);
    return function(){
      el.removeEventListener(key, handler);
    }
  });
}

Observable.fromEvent = fromEvent;
Observable.fromPromise = fromPromise;
Observable.from = from;
Observable.pipe = pipe;