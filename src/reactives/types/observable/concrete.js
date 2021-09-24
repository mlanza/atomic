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

function share1(source){
  return share2(source, subject());
}

function share2(source, sink){
  let disconnect = _.noop,
      refs = 0;
  return observable(function(observer){
    if (refs === 0) {
      disconnect = sub(source, sink);
    }
    refs++;
    let unsub = sub(sink, observer);
    return _.once(function(){
      refs--;
      if (refs === 0){
        disconnect();
        disconnect = _.noop;
      }
      unsub();
    });
  });
}

export const share = _.overload(null, share1, share2);

export function sharing(source, init){
  return share(source, init());
}

function seed2(init, source){
  return observable(function(observer){
    const handle = pub(observer, ?);
    handle(init());
    return sub(source, handle);
  });
}

function seed1(source){
  return seed2(_.constantly(null), source);
}

//adds an immediate value upon subscription as with cells.
export const seed = _.overload(null, seed1, seed2);

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

function fromEvents2(el, keys){
  return _.apply(_.merge, _.map(fromEvent2(el, ?), _.split(keys, ' ')));
}

function fromEvents3(el, keys, selector){
  return _.apply(_.merge, _.map(fromEvent3(el, ?, selector), _.split(keys, ' ')));
}

const fromEvent = _.overload(null, null, fromEvents2, fromEvents3)

function computed(f, source){
  return seed(f, pipe(source, t.map(f)));
}

function fromElement(key, f, el){
  return computed(function(){
    return f(el);
  }, fromEvent(el, key));
}

function hash(window){
  return computed(function(e){
    return window.location.hash;
  }, fromEvent(window, "hashchange"));
}

function indexed(sources){
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

function splay1(sources){
  return splay2(sources, null);
}

function splay2(sources, blank){
  const source = indexed(sources);
  return observable(function(observer){
    let state = _.mapa(_.constantly(blank), sources);
    return sub(source, function(msg){
      state = _.assoc(state, msg.key, msg.value);
      pub(observer, state);
    });
  });
}

const splay = _.overload(null, splay1, splay2);

//sources must publish an initial value immediately upon subscription as cells do.
function latest(sources){
  const nil = {}, source = splay2(sources, nil);
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

function toggles(el, on, off, init){
  return seed(
    init,
    _.merge(
        pipe(fromEvent(el, on), t.constantly(true)),
        pipe(fromEvent(el, off), t.constantly(false))));
}

function focus(el){
  return toggles(el, "focus", "blur", function(){
    return el === el.ownerDocument.activeElement;
  });
}

function click(el){
  return fromEvent(el, "click");
}

function hover(el){
  return toggles(el, "mouseover", "mouseout", _.constantly(false));
}

function fixed(value){
  return observable(function(observer){
    pub(observer, value);
    complete(observer);
  });
}

function time(){
  return _.date().getTime();
}

function tick2(interval, f){
  return observable(function(observer){
    const iv = setInterval(function(){
      pub(observer, f());
    }, interval);
    return function(){
      clearInterval(iv);
    }
  });
}

const tick = _.overload(null, tick2(?, time), tick2);

function when2(interval, f){
  return seed(f, tick(interval, f));
}

const when = _.overload(null, when2(?, time), when2);

function map2(f, source){
  return pipe(source, t.map(f), t.dedupe());
}

function mapN(f, ...sources){
  return map2(_.spread(f), latest(sources));
}

const map = _.overload(null, null, map2, mapN);

function resolve(source){
  return observable(function(observer){
    return sub(source, function(value){
      Promise.resolve(value).then(pub(observer, ?));
    });
  });
}

function depressed(el){
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

function hist2(size, source){
  return pipe(source, t.hist(size));
}

const hist = _.overload(null, hist2(2, ?), hist2);

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

_.extend(_.ICoercible, {toObservable: null});

_.doto(Observable,
  _.implement(_.ICoercible, {toObservable: _.identity}));

_.doto(Promise,
  _.implement(_.ICoercible, {toObservable: fromPromise}));

Object.assign(Observable, {latest, map, hist, splay, indexed, computed, fromSource, fromEvent, fromPromise, fromElement, fixed, hash, tick, when, resolve, depressed, toggles, focus, click, hover});
