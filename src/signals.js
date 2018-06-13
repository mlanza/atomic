/*
* Signals allow error handling to be handled as a separate (composable) concern rather than an integrated one.
* Signals are transducer friendly.
* When building an application from a signal graph there is a tendency to think that events are no longer relevant, that everything must be a signal, but this is inappropriate.  Both can be appropriate.  Use events when there is no reason for an initial value.
*/

import {implement, partial, observable, publisher, subscriptionMonitor, slice} from "./core/types";
import {map} from "./transducers";
import {IEvented, IPublish, ISubscribe, IDisposable} from "./core/protocols";
import {doto, overload, identity, constantly} from "./core/core";

function duct(sink, xf, source){
  const unsub = ISubscribe.sub(source, partial(xf(IPublish.pub), sink));
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
    unsub = active ? IEvented.on(el, key, function(e){
      IPublish.pub(sink, transform(e));
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
    ISubscribe.sub(source, function(value){
      state = slice(state);
      state[idx] = value;
      if (!initialized){
        initialized = state.indexOf(blank) === -1;
      }
      if (initialized){
        IPublish.pub(sink, f.apply(null, state));
      }
    });
  });
  return sink;
}

function hist2(size, source){
  const sink = observable([]);
  let history = [];
  ISubscribe.sub(source, function(value){
    history = slice(history);
    history.unshift(value);
    if (history.length > size){
      history.pop();
    }
    IPublish.pub(sink, history);
  });
  return sink;
}

export const hist = overload(null, partial(hist2, 2), hist2);

export function join(init, ...sources){ //TODO dispose
  const sink  = observable(init || null),
        relay = partial(IPublish.pub, sink);
  sources.forEach(function(source){
    ISubscribe.sub(source, relay);
  });
  return sink;
}

export function fork(pred, inits, source){
  const leftSink  = observable(inits[0] || null),
        rightSink = observable(inits[1] || null);
  ISubscribe.sub(source, function(value){
    const sink = pred(value) ? leftSink : rightSink;
    IPublish.pub(sink, value);
  });
  return [leftSink, rightSink];
}

export function deferred(promise){
  const sink = observable(null);
  Promise.resolve(promise).then(partial(IPublish.pub, sink));
  return sink;
}