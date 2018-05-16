/*
* Signals allow error handling to be handled as a separate (composable) concern rather than an integrated one.
* Signals are transducer friendly.
* When building an application from a signal graph there is a tendency to think that events are no longer relevant, that everything must be a signal, but this is inappropriate.  Both can be appropriate.  Use events when there is no reason for an initial value.
*/

import {partial, observable, publisher, subscriptionMonitor, slice} from "./types";
import {implement} from "./protocol";
import {map} from "./transducers";
import {pub, sub, IDisposable} from "./protocols";
import {doto, overload, identity, constantly} from "./core";

function duct(sink, xf, source){
  const unsub = sub(source, partial(xf(pub), sink));
  return doto(sink,
    implement(IDisposable, {dispose: unsub}));
}

function signal2(xf, source){
  return signal3(xf, null, source);
}

function signal3(xf, init, source){
  return duct(observable(init), xf, source);
}

export const signal = overload(null, null, signal2, signal3);

export function listen(el, key, callback){
  el.addEventListener(key, callback);
  return function(){
    unlisten(el, key, callback);
  }
}

export function unlisten(el, key, callback){
  el.removeEventListener(key, callback);
}

export function event3(el, key, init){
  return event4(el, key, init, identity);
}

export function event4(el, key, init, transform){
  let unsub = null;
  function dispose(){
    unsub && unsub();
    unsub = null;
  }
  const publ = subscriptionMonitor(publisher(), function(active){
    dispose();
    unsub = active ? listen(el, key, function(e){
      pub(sink, transform(e));
    }) : null;
  });
  const sink = observable(init, publ);
  return doto(sink,
    implement(IDisposable, {dispose: dispose}));
}

export const event = overload(null, null, null, event3, event4);

export function mousemove(el){
  return event(el, "mousemove", [], function(e){
    return [e.clientX, e.clientY];
  });
}

export function keydown(document){
  return event(document, "keydown", null);
}

export function keyup(document){
  return event(document, "keyup", null);
}

export function keypress(document){
  return event(document, "keypress", null);
}

export function hashchange(window){
  return event(window, "hashchange", "", function(){
    return location.hash;
  });
}

export function change(el){
  return event(el, "change", el.value, function(){
    return el.value;
  });
}

export function input(el){
  return event(el, "input", el.value, function(){
    return el.value;
  });
}

export function focus(el){
  return join(el === document.activeElement,
    event(el, "focus", null, constantly(true)),
    event(el, "blur" , null, constantly(false)));
}

export function calc(f, ...sources){
  const sink  = observable(null),
        blank = {};
  let initialized = false,
      state = [];
  sources.forEach(function(){
    state.push(blank);
  });
  sources.forEach(function(source, idx){
    sub(source, function(value){
      state = slice(state);
      state[idx] = value;
      if (!initialized){
        initialized = state.indexOf(blank) === -1;
      }
      if (initialized){
        pub(sink, f.apply(null, state));
      }
    });
  });
  return sink;
}

function hist2(size, source){
  const sink = observable([]);
  let history = [];
  sub(source, function(value){
    history = slice(history);
    history.unshift(value);
    if (history.length > size){
      history.pop();
    }
    pub(sink, history);
  });
  return sink;
}

export const hist = overload(null, partial(hist2, 2), hist2);

export function join(init, ...sources){ //TODO dispose
  const sink  = observable(init || null),
        relay = partial(pub, sink);
  sources.forEach(function(source){
    sub(source, relay);
  });
  return sink;
}

export function fork(pred, inits, source){
  const leftSink  = observable(inits[0] || null),
        rightSink = observable(inits[1] || null);
  sub(source, function(value){
    const sink = pred(value) ? leftSink : rightSink;
    pub(sink, value);
  });
  return [leftSink, rightSink];
}

export function deferred(promise){
  const sink = observable(null);
  Promise.resolve(promise).then(partial(pub, sink));
  return sink;
}