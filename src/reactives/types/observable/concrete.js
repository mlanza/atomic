import * as _ from "atomic/core";
import * as t from "atomic/transducers";
import Promise from "promise";
import {ISubscribe} from "../../protocols.js";
import {pub, err, complete, closed, sub, unsub} from "../../protocols/concrete.js";
import {Observable, observable} from "./construct.js";
import {Observer, observer} from "../observer/construct.js";
import {Subject, subject} from "../subject/construct.js";

function pipeN(source, ...xforms){
  return pipe2(source, _.comp(...xforms));
}

function pipe2(source, xform){
  return observable(function(obs){
    const step = xform(_.overload(null, _.reduced, function(memo, value){
      pub(memo, value);
      return memo;
    }));
    const sink = observer(function(value){
      const memo = step(obs, value);
      if (_.isReduced(memo)){
        complete(sink);
      }
    }, function(error){
      err(obs, error);
      unsub && unsub();
    }, function(){
      step(obs);
      complete(obs);
      unsub && unsub();
    });
    const unsub = sub(source, sink); //might complete before returning `unsub` fn
    if (closed(sink)) {
      unsub();
      return _.noop;
    }
    return unsub;
  });
}

export const pipe = _.overload(null, _.identity, pipe2, pipeN);

function multiplex1(source){
  return multiplex2(source, subject());
}

function multiplex2(source, sink){
  let disconnect = _.noop,
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
        disconnect = _.noop;
      }
      unsub();
    }
  });
}

export const multiplex = _.overload(null, multiplex1, multiplex2);

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
      if (_.matches(e.target, selector)) {
        handler(observer, e);
      } else {
        const found = _.closest(e.target, selector);
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

//const fromEvent = _.overload(null, null, fromEvent2, fromEvent3)

function fromEvents2(el, keys){
  return _.apply(_.merge, _.map(fromEvent2(el, ?), _.split(keys, ' ')));
}

function fromEvents3(el, keys, selector){
  return _.apply(_.merge, _.map(fromEvent3(el, ?, selector), _.split(keys, ' ')));
}

export const fromEvent = _.overload(null, null, fromEvents2, fromEvents3)

function seed2(init, source){
  return _.doto(observable(function(observer){
    const handle = pub(observer, ?);
    handle(init());
    return sub(source, handle);
  }),
    _.specify(_.IDeref, {deref: init})); //TODO remove after migration, this is for `sink` compatibility only
}

function seed1(source){
  return seed2(_.constantly(null), source);
}

//adds an immediate value upon subscription as with cells.
export const seed = _.overload(null, seed1, seed2);

export function computes(source, f){
  return seed(f, pipe(source, t.map(f)));
}

export function interact(key, f, el){
  return computes(fromEvent(el, key), function(){
    return f(el);
  });
}

export function hash(window){
  return computes(fromEvent(window, "hashchange"), function(e){
    return window.location.hash;
  });
}

export function indexed(sources){
  return observable(function(observer){
    return _.just(sources,
      _.mapIndexed(function(key, source){
        return sub(source, function(value){
          pub(observer, {key, value});
        });
      }, ?),
      _.toArray,
      _.spread(_.does));
  })
}

function _currents1(sources){
  return _currents2(sources, null);
}

function _currents2(sources, blank){
  const source = indexed(sources);
  return observable(function(observer){
    let state = _.toArray(_.take(_.count(sources), _.repeat(blank)));
    return sub(source, function(msg){
      state = _.assoc(state, msg.key, msg.value);
      pub(observer, state);
    });
  });
}

const _currents = _.overload(null, _currents1, _currents2);

//sources must provide an initial current value (e.g. immediately upon subscription as cells do).
export function current(sources){
  const nil = {}, source = _currents(sources, nil);
  return observable(function(observer){
    let init = false;
    return sub(source, function(state){
      if (init) {
        pub(observer, state);
      } else if (!_.includes(state, nil)) {
        init = true;
        pub(observer, state);
      }
    });
  });
}

export function toggles(el, on, off, init){
  return seed(
    init,
    _.merge(
        pipe(fromEvent(el, on), t.constantly(true)),
        pipe(fromEvent(el, off), t.constantly(false))));
}

export function focus(el){
  return toggles(el, "focus", "blur", function(){
    return el === el.ownerDocument.activeElement;
  });
}

export function click(el){
  return fromEvent(el, "click");
}

export function hover(el){
  return toggles(el, "mouseover", "mouseout", _.constantly(false));
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
  return map2(_.spread(f), current(sources));
}

export const calc = _.overload(null, null, map2, mapN); //TODO revert to `map` after migration.

function then2(f, source){
  const src = map2(f, source);
  return observable(function(observer){
    return sub(src, function(value){
      Promise.resolve(value).then(pub(observer, ?));
    });
  });
}

function thenN(f, ...sources){
  return then2(_.spread(f), current(sources));
}

export const andThen = _.overload(null, null, then2, thenN);

//calling this may spark sad thoughts
export function depressed(el){
  return seed(
    _.constantly([]),
    pipe(
      fromEvent(el, "keydown keyup"),
        t.scan(function(memo, e){
          if (e.type === "keyup") {
            memo = _.filtera(_.notEq(e.key, ?), memo);
          } else if (!_.includes(memo, e.key)) {
            memo = _.conj(memo, e.key);
          }
          return memo;
        }, []),
        t.dedupe()));
}

export function toObservable(self){
  const f = _.satisfies(_.ICoercible, "toObservable", self);
  if (f) {
    return f(self);
  } else if (_.satisfies(ISubscribe, "sub", self)) {
    return fromSource(self);
  } else if (_.satisfies(_.ISequential, self)) {
    return fromCollection(self);
  }
}

function fromCollection(coll){
  return observable(function(observer){
    for (var item of coll) {
      pub(observer, item);
      if (closed(observer)) {
        return;
      }
    }
    complete(observer);
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

function fromSource(source){ //can be used to cover a source making it readonly
  return observable(sub(source, ?));
}

_.extend(_.ICoercible, {toObservable: null});

_.doto(Observable,
  _.implement(_.ICoercible, {toObservable: _.identity}));

_.doto(Promise,
  _.implement(_.ICoercible, {toObservable: fromPromise}));
