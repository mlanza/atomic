import {
  IDeref,
  ICollection,
  IDisposable,
  IReset,
  ISwap,
  IAssociative,
  IFunctor,
  ICounted,
  Promise,
  doto,
  does,
  deref,
  overload,
  apply,
  identity,
  constantly,
  memoize,
  each,
  filtera,
  doall,
  mapa,
  mapIndexed,
  comp,
  partial,
  spread,
  str,
  first,
  notEq,
  implement,
  satisfies,
  specify,
  slice,
  transduce,
  called,
  noop,
  weakMap
} from "atomic/core";
import * as _ from "atomic/core";
import * as t from "atomic/transducers";
import Symbol from "symbol";
import {pub, err, complete, sub, unsub, on, off, one, into} from "./protocols/concrete.js";
import {IDispatch, IPublish, ISubscribe, IEvented} from "./protocols.js";
import {
  Cell,
  cell,
  readonly,
  AudienceDetector,
  audienceDetector,
  Subject,
  subject,
  Observable,
  observable,
  Observer,
  observer
} from "./types.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";

//TODO that promises could potentially return out of order is a problem!
export function then2(f, source){
  const sink = cell(null);
  function observe(value){
    IFunctor.fmap(Promise.resolve(f(value)), partial(pub, sink));
  }
  function dispose(self){
    ISubscribe.unsub(source, observe);
  }
  ISubscribe.sub(source, observe);
  return doto(readonly(sink),
    specify(IDisposable, {dispose}));
}

function thenN(f, ...sources){
  return then2(spread(f), latest(sources));
}

export const then = overload(null, null, then2, thenN);

function signal1(source){
  return signal2(t.map(identity), source);
}

function signal2(xf, source){
  return signal3(xf, null, source);
}

function signal3(xf, init, source){
  return signal4(audienceDetector, xf, init, source);
}

function signal4(into, xf, init, source){
  return into(cell(init), xf, source);
}

export const signal = overload(null, signal1, signal2, signal3, signal4);

function sink(source){
  return satisfies(IDeref, source) ? cell() : subject();
}

function via2(xf, source){
  return into(sink(source), xf, source);
}

function viaN(xf, ...sources){
  return via2(spread(xf), latest(sources));
}

export const via = called(overload(null, null, via2, viaN), "`via` is deprecated — use `connect` instead.");

function connect2(source, sink){
  return connect3(source, t.identity(), sink);
}

function connect3(source, xform, sink){
  return transduce(xform, IPublish.pub, source, sink);
}

export const connect = overload(null, null, connect2, connect3); //returns `disconnect` fn

function map2(f, source){
  return via2(comp(t.map(f), t.dedupe()), source);
}

function mapN(f, ...sources){
  return map2(spread(f), latest(sources));
}

export const map = overload(null, null, map2, mapN);

export function computed(f, source){
  const sink = cell(f(source));
  function callback(){
    IReset.reset(sink, f(source));
  }
  function pub(self, value){
    IPublish.pub(source, value);
  }
  return doto(audienceDetector(sink, function(state){
    const f = state == "active" ? ISubscribe.sub : ISubscribe.unsub;
    f(source, callback);
  }),
    specify(IPublish, {pub}));
}

function fmap(source, f){
  return map(f, source);
}

each(implement(IFunctor, {fmap}), [AudienceDetector, Cell, Subject]);

export function mousemove(el){
  return signal(t.map(function(e){
    return [e.clientX, e.clientY];
  }), [], event(el, "mouseenter mousemove"));
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
  }, [], join(subject(), keydown(el), keyup(el))));
}

export const hashchange = called(function hashchange(window){
  return signal(t.map(function(){
    return location.hash;
  }), location.hash, event(window, "hashchange"));
}, "`hashchange` is deprecated — use `hashChange` instead.");

function fromPromise1(promise){
  return fromPromise2(promise, null);
}

function fromPromise2(promise, init){
  const sink = cell(init);
  IFunctor.fmap(promise, IPublish.pub(sink, ?));
  return sink;
}

export const fromPromise = overload(null, fromPromise1, fromPromise2);

export function fromElement(events, f, el){
  return signal(t.map(function(){
    return f(el);
  }), f(el), event(el, events));
}

export function focus(el){
  return join(cell(el === document.activeElement),
    via(t.map(constantly(true)), event(el, "focus")),
    via(t.map(constantly(false)), event(el, "blur")));
}

export function join(sink, ...sources){
  const callback = IPublish.pub(sink, ?);
  return audienceDetector(sink, function(state){
    const f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
    each(f(?, callback), sources);
  });
}

export const fixed = comp(readonly, cell);

export const latest = called(function latest(sources){
  const sink = cell(mapa(constantly(null), sources));
  const fs = memoize(function(idx){
    return function(value){
      ISwap.swap(sink, IAssociative.assoc(?, idx, value));
    }
  }, str);
  return audienceDetector(sink, function(state){
    const f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
    doall(mapIndexed(function(idx, source){
      f(source, fs(idx));
    }, sources));
  });
}, "`latest` is deprecated — use `spreadsInit` instead.");

function hist2(size, source){
  const sink = cell([]);
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


function event2(el, key){
  const sink = subject(), callback = partial(IPublish.pub, sink);
  return audienceDetector(sink, function(status){
    const f = status === "active" ? on : off;
    f(el, key, callback);
  });
}

function event3(el, key, selector){
  const sink = subject(), callback = partial(IPublish.pub, sink);
  return audienceDetector(sink, function(status){
    if (status === "active") {
      on(el, key, selector, callback);
    } else {
      off(el, key, callback);
    }
  });
}

export const event = called(overload(null, null, event2, event3), "`event` deprecated - use `fromEvent` instead.");

export function click(el){
  return event(el, "click");
}

//enforce sequential nature of operations
function isolate(f){ //TODO treat operations as promises
  const queue = [];
  return function(){
    const ready = queue.length === 0;
    queue.push(arguments);
    if (ready) {
      while (queue.length) {
        const args = first(queue);
        try {
          f.apply(null, args);
          IEvented.trigger(args[0], "mutate", {bubbles: true});
        } finally {
          queue.shift();
        }
      }
    }
  }
}

function mutate3(self, state, f){
  ISubscribe.sub(state, partial(isolate(f), self));
  return self;
}

function mutate2(state, f){
  return mutate3(?, state, f);
}

export const mutate = overload(null, null, mutate2, mutate3);

(function(){

  function dispatch(self, args){
    return apply(self, args);
  }

  function pub(self, msg){
    self(msg);
  }

  doto(Function,
    implement(IPublish, {pub, err: noop, complete: noop}),
    implement(IDispatch, {dispatch}));

})();