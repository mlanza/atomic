/*
* Signals allow error handling to be handled as a separate (composable) concern rather than an integrated one.
* Signals are transducer friendly.
* When building an application from a signal graph there is a tendency to think that events are no longer relevant, that everything must be a signal, but this is inappropriate.  Both can be appropriate.  Use events when there is no reason for an initial value.
*/

import {IDeref, IEvented, IPublish, ISubscribe, ICollection, IDisposable, ISwap, IAssociative, IFunctor} from "./core/protocols";
import {doto, effect, overload, identity, constantly} from "./core/core";
import {detect, filtera, mapa, mapIndexed} from "./core/types/lazy-seq/concrete";
import {comp, apply, partial, spread} from "./core/types/function/concrete";
import {mappedSignal} from "./core/types/mapped-signal/construct";
export {mappedSignal as map} from "./core/types/mapped-signal/construct";
import Promise from "./core/types/promise/construct";
import LazyPublication, {lazyPub} from "./core/types/lazy-pub/construct";
import Publisher, {publisher} from "./core/types/publisher/construct";
import Observable, {observable} from "./core/types/observable/construct";
import {event} from "./core/types/element/concrete";
import {notEq, eq} from "./core/predicates";
import {implement} from "./core/types/protocol";
import * as t from "./transducers";

function signal1(source){
  return signal2(t.map(identity), source);
}

function signal2(xf, source){
  return signal3(xf, null, source);
}

function signal3(xf, init, source){
  return lazyPub(observable(init), xf, source);
}

export const signal = overload(null, signal1, signal2, signal3);

function fmap(source, f){
  return mappedSignal(f, source); //signal3(comp(t.map(f), t.dedupe()), f(IDeref.deref(source)), source);
}

const fmappable = implement(IFunctor, {fmap});

fmappable(LazyPublication);
fmappable(Observable);
fmappable(Publisher);

export function mousemove(el){
  return signal(t.map(function(e){
    return [e.clientX, e.clientY];
  }), [], event(el, "mousemove"));
}

export function keydown(el){
  return signal(event(el, "keydown"));
}

export function keyup(el){
  return signal(event(el, "keyup"));
}

export function keypress(el){
  return signal(event(el, "keypress"));
}

export function scan(f, init, source){
  let memo = init;
  return signal(t.map(function(value){
    memo = f(memo, value);
    return memo;
  }), init, source);
}

export function pressed(el){
  return signal(t.dedupe(), [], scan(function(memo, value){
    if (value.type === "keyup") {
      memo = filtera(partial(notEq, value.key), memo);
    } else if (memo.indexOf(value.key) === -1) {
      memo = ICollection.conj(memo, value.key);
    }
    return memo;
  }, [], join(publisher(), keydown(el), keyup(el))));
}

export function hashchange(window){
  return signal(t.map(function(e){
    return location.hash;
  }), "", event(window, "hashchange"));
}

export function change(el){
  return signal(t.map(function(){
    return el.value;
  }), el.value, event(el, "change"));
}

export function input(el){
  return signal(t.map(function(){
    return el.value;
  }), el.value, event(el, "input"));
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
  return signal(comp(t.filter(function(xs){
    return !detect(partial(eq, blank), xs);
  }), t.map(spread(f))), lazyPub(sink, function(sink){
    return apply(effect, mapIndexed(function(idx, source){
      return ISubscribe.sub(source, function(value){
        ISwap.swap(sink, function(state){
          return IAssociative.assoc(state, idx, value);
        });
      });
    }, sources));
  }));
}

function hist2(size, source){
  const sink = observable([]);
  let history = [];
  ISubscribe.sub(source, function(value){
    history = [...history];
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
  return lazyPub(sink, function(sink){
    return effect.apply(null, mapa(function(source){
      return ISubscribe.sub(source, send);
    }, sources));
  });
}

export function fromPromise(promise){
  const sink = observable(null);
  Promise.resolve(promise).then(partial(IPublish.pub, sink));
  return sink;
}