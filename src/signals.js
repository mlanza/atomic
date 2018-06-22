/*
* Signals allow error handling to be handled as a separate (composable) concern rather than an integrated one.
* Signals are transducer friendly.
* When building an application from a signal graph there is a tendency to think that events are no longer relevant, that everything must be a signal, but this is inappropriate.  Both can be appropriate.  Use events when there is no reason for an initial value.
*/

import {implement, partial, observable, publisher, lazyPub, slice, event, map, mapa, apply} from "./core/types";
import * as t from "./transducers";
import {IEvented, IPublish, ISubscribe, IDisposable} from "./core/protocols";
import {doto, effect, overload, identity, constantly} from "./core/core";

function signal2(xf, source){
  return signal3(xf, null, source);
}

function signal3(xf, init, source){
  return lazyPub(observable(init), xf, source);
}

export const signal = overload(null, null, signal2, signal3);

export function mousemove(el){
  return signal(observable([]), t.map(function(e){
    return [e.clientX, e.clientY];
  }), event(el, "mousemove"));
}

export function keydown(document){
  return join(observable(null), event(document, "keydown"));
}

export function keyup(document){
  return join(observable(null), event(document, "keyup"));
}

export function keypress(document){
  return join(observable(null), event(document, "keypress"));
}

export function hashchange(window){
  return signal(observable(""), t.map(function(e){
    return location.hash;
  }), event(window, "hashchange"));
}

export function change(el){
  return signal(observable(el.value), t.map(function(){
    return el.value;
  }), event(el, "change"));
}

export function input(el){
  return signal(observable(el.value), t.map(function(){
    return el.value;
  }), event(el, "input"));
}

export function focus(el){
  const sink = observable(el === document.activeElement);
  return join(sink,
    signal(sink, t.map(constantly(true)), event(el, "focus")),
    signal(sink, t.map(constantly(false)), event(el, "blur")));
}

export function calc(f, ...sources){
  const blank = {},
        sink  = observable(mapa(constantly(blank), sources));
  let initialized = false, state = [];

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
  return lazyPublication(sink, function(sink){
    return apply(effect, mapIndexed(function(idx, source){
      return ISubscribe.sub(source, function(value){
        swap(sink, function(state){
          return assoc(state, idx, value);
        });
      });
    }, sources));
  })
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

export function join(sink, ...sources){ //TODO dispose
  const send = partial(IPublish.pub, sink);
  return lazyPublication(sink, function(sink){
    return effect.apply(null, map(function(source){
      return ISubscribe.sub(source, send);
    }, sources));
  });
}

export function fromPromise(promise){
  const sink = observable(null);
  Promise.resolve(promise).then(partial(IPublish.pub, sink));
  return sink;
}