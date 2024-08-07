import * as _ from "atomic/core";
import * as t from "../../transducers.js";
import {ISubscribe} from "../../protocols.js";
import {pub, err, complete, closed, sub, chan} from "../../protocols/concrete.js";
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
    let unsub = _.noop;
    const sink = observer(function(value){
      const memo = step(obs, value);
      if (_.isReduced(memo)){
        complete(sink);
      }
    }, function(error){
      err(obs, error);
      unsub();
    }, function(){
      step(obs);
      complete(obs);
      unsub();
    });
    unsub = sub(source, sink); //might complete before returning `unsub` fn
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

export function shared(sink, ...fs){
  return _.comp(sharing(?, sink), ...fs);
}

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

//adds an immediate value upon subscription as with atoms.
export const seed = _.overload(null, seed1, seed2);

function computed(f, source){
  return seed(f, pipe(source, _.map(f)));
}

function interact(key, f, el){
  return computed(function(){
    return f(el);
  }, chan(el, key));
}

function indexed(sources){
  return observable(function(observer){
    return _.chain(sources,
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

//sources must publish an initial value immediately upon subscription as atoms do.
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
        pipe(chan(el, on), _.map(_.constantly(true))),
        pipe(chan(el, off), _.map(_.constantly(false)))));
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

function tick3(interval, frame = 0, f = time){
  return observable(function(observer){
    const seed = performance.now();
    const target = seed + frame * interval;
    const self = {seed, target, frame, stopped: false};
    function callback(){
      self.offage = performance.now() - self.target;
      if (self.offage >= 0) {
        pub(observer, f(self));
        self.frame += 1;
        self.target = self.seed + self.frame * interval;
      }
      const delay = Math.abs(Math.round(Math.min(0, self.offage), 0));
      self.stopped || setTimeout(callback, delay);
    }
    setTimeout(callback, 0);
    return function(){
      self.stopped = true;
      complete(observer);
    }
  });
}

function tick2(interval, f = time){
  return tick3(interval, 0, f);
}

const tick = _.overload(null, tick2, tick2, tick3);

function when2(interval, f){
  return seed(f, tick(interval, f));
}

const when = _.overload(null, when2(?, time), when2);

function map2(f, source){
  return pipe(source, _.map(f), _.dedupe());
}

function mapN(f, ...sources){
  return map2(_.spread(f), latest(sources));
}

const map = _.overload(null, null, map2, mapN);

function resolve(source){
  const queue = [];
  function pop(prom, observer){
    return function(value){
      if (queue[0] === prom) {
        queue.shift();
        pub(observer, value);
        if (queue.length) { //drain queue
          queue[0].then(pop(queue[0], observer));
        }
      }
    }
  }
  return observable(function(observer){
    return sub(source, function(value){
      const prom = Promise.resolve(value);
      queue.push(prom);
      prom.then(pop(prom, observer));
    });
  });
}

function hist2(size, source){
  return pipe(source, t.hist(size));
}

const hist = _.overload(null, hist2(2, ?), hist2);

function fromCollection(coll){
  return observable(function(observer){
    for (let item of coll) {
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

export const fromEvent = chan;

export function toObservable(self){
  const f = _.method(_.coerce, self, Observable);
  if (f) {
    return f(self);
  } else if (_.satisfies(ISubscribe, "sub", self)) {
    return fromSource(self);
  } else if (_.satisfies(_.ISequential, self)) {
    return fromCollection(self);
  }
}

_.addMethod(_.coerce, [Observable, Observable], _.identity);
_.addMethod(_.coerce, [Promise, Observable], fromPromise);

Object.assign(Observable, {latest, map, hist, splay, indexed, computed, fromSource, fromEvent, fromPromise, interact, fixed, tick, when, resolve, toggles});
