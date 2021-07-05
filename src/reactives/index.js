import * as _ from "atomic/core";
import * as t from "atomic/transducers";
import Symbol from "symbol";
import Promise from "promise";
import {pub, err, complete, sub, unsub, on, off, one, into} from "./protocols/concrete.js";
import {IDispatch, IPublish, ISubscribe, IEvented} from "./protocols.js";
import {ireduce} from "./shared.js";
import {
  interact,
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
import {pipe} from "./types/observable/concrete.js";

//TODO that promises could potentially return out of order is a problem!
export function then2(f, source){
  const sink = cell(null);
  function observe(value){
    _.fmap(Promise.resolve(f(value)), _.partial(pub, sink));
  }
  function dispose(self){
    ISubscribe.unsub(source, observe);
  }
  ISubscribe.sub(source, observe);
  return _.doto(readonly(sink),
    _.specify(_.IDisposable, {dispose}));
}

function thenN(f, ...sources){
  return then2(_.spread(f), latest(sources));
}

export const then = _.called(_.overload(null, null, then2, thenN), "`then` is deprecated — use `andThen` and `seed` instead.");

export function collect(cell){
  return function(value){ //return observer
    _.swap(cell, _.conj(?, value));
  }
}

function signal1(source){
  return signal2(t.identity(), source);
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

export const signal = _.called(_.overload(null, signal1, signal2, signal3, signal4), "`signal` is deprecated.");

export const fromElement = _.called(function fromElement(events, f, el){
  return signal(t.map(function(){
    return f(el);
  }), f(el), event(el, events));
}, "`fromElement` is deprecated — use `interact` instead.");

function sink(source){
  return _.satisfies(_.IDeref, source) ? cell() : subject();
}

function via2(xf, source){
  return into(sink(source), xf, source);
}

function viaN(xf, ...sources){
  return via2(_.spread(xf), latest(sources));
}

export const via = _.called(_.overload(null, null, via2, viaN), "`via` is deprecated.");

function connect2(source, sink){
  return sub(source, sink);
}

function connect3(source, xform, sink){
  return sub(pipe(source, xform), sink);
}

function connectN(source){
  const sink = arguments[arguments.length - 1],
        xforms = _.slice(arguments, 1, arguments.length - 1);
  return sub(pipe(source, ...xforms), sink);
}

export const connect = _.overload(null, null, connect2, connect3, connectN); //returns `unsub` fn

function map2(f, source){
  return via2(_.comp(t.map(f), t.dedupe()), source);
}

function mapN(f, ...sources){
  return map2(_.spread(f), latest(sources));
}

export const map = _.called(_.overload(null, null, map2, mapN), "`map` is deprecated — use `calc` instead.");

export const computed = _.called(function computed(f, source){
  const sink = cell(f(source));
  function callback(){
    _.reset(sink, f(source));
  }
  function pub(self, value){
    IPublish.pub(source, value);
  }
  return _.doto(audienceDetector(sink, function(state){
    const f = state == "active" ? ISubscribe.sub : ISubscribe.unsub;
    f(source, callback);
  }),
    _.specify(IPublish, {pub}));
}, "`computed` is deprecated — use `computes` instead.");

function fmap(source, f){
  return map(f, source);
}

_.each(_.implement(_.IFunctor, {fmap}), [AudienceDetector, Cell, Subject, Observable]);

function fromPromise1(promise){
  return fromPromise2(promise, null);
}

function fromPromise2(promise, init){
  const sink = cell(init);
  _.fmap(promise, IPublish.pub(sink, ?));
  return sink;
}

export const fromPromise = _.called(_.overload(null, fromPromise1, fromPromise2), "`fromPromise` is deprecated — use `Observable.from` and `seed` instead.");

export const join = _.called(function join(sink, ...sources){
  const callback = IPublish.pub(sink, ?);
  return audienceDetector(sink, function(state){
    const f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
    _.each(f(?, callback), sources);
  });
}, "`join` is deprecated — use `merge` instead.");

export const fixed = _.called(_.comp(readonly, cell), "`fixed` is deprecated — use `always` instead.");

export const latest = _.called(function latest(sources){
  const sink = cell(_.mapa(_.constantly(null), sources));
  const fs = _.memoize(function(idx){
    return function(value){
      _.swap(sink, _.assoc(?, idx, value));
    }
  }, _.str);
  return audienceDetector(sink, function(state){
    const f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
    _.doall(_.mapIndexed(function(idx, source){
      f(source, fs(idx));
    }, sources));
  });
}, "`latest` is deprecated — use `current` instead."); //TODO after migration revert to `latest`

function hist2(size, source){
  const sink = cell([]);
  let history = [];
  ISubscribe.sub(source, function(value){
    history = _.slice(history);
    history.unshift(value);
    if (history.length > size){
      history.pop();
    }
    IPublish.pub(sink, history);
  });
  return sink;
}

export const hist = _.called(_.overload(null, _.partial(hist2, 2), hist2), "`hist` is deprecated — use `hist` transducer instead.");

function event2(el, key){
  const sink = subject(), callback = _.partial(IPublish.pub, sink);
  return audienceDetector(sink, function(status){
    const f = status === "active" ? on : off;
    f(el, key, callback);
  });
}

function event3(el, key, selector){
  const sink = subject(), callback = _.partial(IPublish.pub, sink);
  return audienceDetector(sink, function(status){
    if (status === "active") {
      on(el, key, selector, callback);
    } else {
      off(el, key, callback);
    }
  });
}

export const event = _.called(_.overload(null, null, event2, event3), "`event` deprecated - use `fromEvent` instead.");

//enforce sequential nature of operations
function isolate(f){ //TODO treat operations as promises
  const queue = [];
  return function(){
    const ready = queue.length === 0;
    queue.push(arguments);
    if (ready) {
      while (queue.length) {
        const args = _.first(queue);
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
  ISubscribe.sub(state, _.partial(isolate(f), self));
  return self;
}

function mutate2(state, f){
  return mutate3(?, state, f);
}

export const mutate = _.called(_.overload(null, null, mutate2, mutate3), "`mutate` is deprecated — use `render` instead.");

function render3(el, obs, f){
  return sub(obs, t.isolate(), function(state){
    f(el, state);
    IEvented.trigger(el, "mutate", {bubbles: true}); //TODO rename
  });
}

function render2(state, f){
  return render3(?, state, f);
}

export const render = _.overload(null, null, render2, render3);

function renderDiff3(el, obs, f){
  return sub(obs, t.isolate(), t.hist(2), function(history){
    const args = [el].concat(history);
    f.apply(this, args); //overload arity 2 & 3 for initial and diff rendering
    IEvented.trigger(el, "mutate", {bubbles: true}); //TODO rename
  });
}

function renderDiff2(state, f){
  return renderDiff3(?, state, f);
}

//TODO replace render after migration
export const renderDiff = _.overload(null, null, renderDiff2, renderDiff3);

(function(){

  function dispatch(self, args){
    return _.apply(self, args);
  }

  function pub(self, msg){
    self(msg);
  }

  _.doto(Function,
    ireduce, //makes fns work as observers like `cell`, e.g. `$.connect($.tick(3000), _.see("foo"))`
    _.implement(IPublish, {pub, err: _.noop, complete: _.noop, closed: _.noop}),
    _.implement(IDispatch, {dispatch}));

})();
