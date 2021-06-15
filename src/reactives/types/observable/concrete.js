import {IReduce, comp, each, identity, overload, unreduced, noop, isReduced} from "atomic/core";
import {pub, err, complete, sub} from "../../protocols/concrete.js";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {Observable, observable} from "./construct.js";
import {observer} from "../observer/construct.js";
import {subject} from "../subject/construct.js";

function pipeN(source, ...xforms){
  return pipe2(source, comp(...xforms));
}

function pipe2(source, xform){
  return observable(function(obs){
    const step = xform(pub);
    const wrapped = observer(function(value){
      const memo = step(obs, value);
      if (isReduced(memo)){
        complete(wrapped);
      }
      return obs;
    }, function(error){
      err(obs, error);
      unsub();
    }, function(){
      complete(obs);
      unsub();
    });
    const unsub = sub(source, wrapped);
    return unsub;
  });
}

export const pipe = overload(null, null, pipe2, pipeN);

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

export function multiplex(source) {
  const subj = subject();
  let disconnect = noop,
      refs = 0;
  return observable(function(observer){
    if (refs === 0) {
      disconnect = sub(source, subj);
    }
    refs++;
    console.log("inc refs", refs);
    let unsub = sub(subj, observer);
    return function(){
      refs--;
      console.log("dec refs", refs);
      if (refs === 0){
        disconnect();
        disconnect = noop;
      }
      unsub();
    }
  });
}

Observable.fromEvent = fromEvent;
Observable.fromPromise = fromPromise;
Observable.from = from;
Observable.pipe = pipe;
