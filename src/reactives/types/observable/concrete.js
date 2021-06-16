import {just, slice, take, assoc, count, includes, repeat, matches, comp, each, overload, noop, mapIndexed, spread, does, toArray, isReduced} from "atomic/core";
import * as dom from "atomic/dom";
import {pub, err, complete, sub, unsub} from "../../protocols/concrete.js";
import {Observable, observable} from "./construct.js";
import {Observer, observer} from "../observer/construct.js";
import {Subject, subject} from "../subject/construct.js";

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
      unsub && unsub();
    }, function(){
      complete(obs);
      unsub && unsub();
    });
    const unsub = sub(source, wrapped); //might complete before returning `unsub` fn
    return unsub;
  });
}

export const pipe = overload(null, null, pipe2, pipeN);

function multiplex1(source){
  return multiplex2(source, subject());
}

function multiplex2(source, sink){
  let disconnect = noop,
      refs = 0;
  return observable(function(observer){
    if (refs === 0) {
      disconnect = sub(source, sink);
    }
    refs++;
    let unsub = sub(sink, observer);
    return function(){
      refs--;
      if (refs === 0){
        disconnect();
        disconnect = noop;
      }
      unsub();
    }
  });
}

export const multiplex = overload(null, multiplex1, multiplex2);

function fromEvent2(el, key) {
  return observable(function(observer){
    const handler = pub(observer, ?);
    el.addEventListener(key, handler);
    return function(){
      el.removeEventListener(key, handler);
    }
  });
}

function fromEvent3(el, key, selector){
  return observable(function(observer){
    const handler = pub(observer, ?);
    function delegate(e){
      if (matches(e.target, selector)) {
        handler(observer, e);
      } else {
        const found = dom.closest(e.target, selector);
        if (found && el.contains(found)) {
          handler(observer, Object.assign(Object.create(e), {target: found}));
        }
      }
    }
    el.addEventListener(key, delegate);
    return function(){
      el.removeEventListener(key, delegate);
    }
  });
}

export const fromEvent = overload(null, null, fromEvent2, fromEvent3)

export function initialized(source, init){
  return observable(function(observer){
    const handle = pub(observer, ?);
    handle(init());
    return sub(source, handle);
  });
}

function fromPromise(promise){
  return observable(function(observer){
    promise.
      then(pub(observer, ?), err(observer, ?)).
      then(function(){
        complete(observer);
      });
  });
}

export function calc(source, f){
  return initialized(pipe(source, t.map(f)), f);
}

export function hashChange(window){
  return calc(fromEvent(window, "hashchange"), function(e){
    return location.hash;
  });
}

export function indexed(sources){
  return observable(function(observer){
    return just(sources,
      mapIndexed(function(key, source){
        return sub(source, function(value){
          pub(observer, {key, value});
        });
      }, ?),
      toArray,
      spread(does));
  })
}

function _currents1(sources){
  return _currents2(sources, null);
}

function _currents2(sources, blank){
  const source = indexed(sources);
  return observable(function(observer){
    let state = toArray(take(count(sources), repeat(blank)));
    return sub(source, function(msg){
      state = assoc(state, msg.key, msg.value);
      pub(observer, state);
    });
  });
}

const _currents = overload(null, _currents1, _currents2);

//sources must provide an initial current value (e.g. immediately upon subscription as cells do).
export function currents(sources){
  const nil = {}, source = _currents(sources, nil);
  return observable(function(observer){
    let initialized = false;
    return sub(source, function(state){
      if (initialized) {
        pub(observer, state);
      } else if (!includes(state, nil)) {
        initialized = true;
        pub(observer, state);
      }
    });
  });
}

function from(coll){
  return observable(function(observer){
    each(pub(observer, ?), coll);
    complete(observer);
  });
}

Observable.fromPromise = fromPromise;
Observable.from = from;