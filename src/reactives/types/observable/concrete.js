import {just, doto, specify, slice, split, take, conj, assoc, count, includes, notEq, constantly, repeat, filtera, matches, comp, each, merge, map, apply, overload, noop, mapIndexed, spread, does, toArray, unreduced, isReduced, IDeref} from "atomic/core";
import * as dom from "atomic/dom";
import * as t from "atomic/transducers";
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
        return unreduced(memo);
      }
      return memo;
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

//const fromEvent = overload(null, null, fromEvent2, fromEvent3)

function fromEvents2(el, keys){
  return apply(merge, map(fromEvent2(el, ?), split(keys, ' ')));
}

function fromEvents3(el, keys, selector){
  return apply(merge, map(fromEvent3(el, ?, selector), split(keys, ' ')));
}

export const fromEvent = overload(null, null, fromEvents2, fromEvents3)

//adds an immediate value upon subscription as with cells.
export function seed(init, source){
  return doto(observable(function(observer){
    const handle = pub(observer, ?);
    handle(init());
    return sub(source, handle);
  }),
    specify(IDeref, {deref: init})); //TODO remove after migration, this is for `sink` compatibility only
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

export function computes(source, f){
  return seed(f, pipe(source, t.map(f)));
}

export function interact(el, key, f){
  return computes(fromEvent(el, key), function(){
    return f(el);
  });
}

export function hash(window){
  return computes(fromEvent(window, "hashchange"), function(e){
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
    let init = false;
    return sub(source, function(state){
      if (init) {
        pub(observer, state);
      } else if (!includes(state, nil)) {
        init = true;
        pub(observer, state);
      }
    });
  });
}

export function toggles(el, on, off, init){
  return seed(
    init,
    merge(
        pipe(fromEvent(el, on), t.constantly(true)),
        pipe(fromEvent(el, off), t.constantly(false))));
}

export function focus(el){
  return toggles(el, "focus", "blur", function(){
    return el === document.activeElement;
  });
}

export function click(el){
  return fromEvent(el, "click");
}

export function hover(el){
  return toggles(el, "mouseover", "mouseout", constantly(false));
}

export function always(value){
  return observable(function(observer){
    pub(observer, value);
    complete(observer);
  });
}

export function tick(interval){
  return observable(function(observer){
    const iv = setInterval(function(){
      pub(observer, (new Date()).getTime());
    }, interval);
    return function(){
      clearInterval(iv);
    }
  });
}

function map2(f, source){
  return pipe(source, t.map(f), t.dedupe());
}

function mapN(f, ...sources){
  return map2(spread(f), currents(sources));
}

const _map = overload(null, null, map2, mapN);

//calling this may spark sad thoughts
export function depressed(el){
  return seed(
    constantly([]),
    pipe(
      fromEvent(el, "keydown keyup"),
        t.scan(function(memo, e){
          if (e.type === "keyup") {
            memo = filtera(notEq(e.key, ?), memo);
          } else if (!includes(memo, e.key)) {
            memo = conj(memo, e.key);
          }
          return memo;
        }, []),
        t.dedupe()));
}

function from(coll){
  return observable(function(observer){
    each(pub(observer, ?), coll);
    complete(observer);
  });
}

//useful for making readonly (e.g. covering over IPublish protocol)
export function toObservable(source){
  return source instanceof Observable ? source : observable(sub(source, ?));
}

Observable.map = _map;
Observable.fromPromise = fromPromise;
Observable.from = from;