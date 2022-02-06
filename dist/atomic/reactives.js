import * as _ from './core.js';
import { protocol, implement, IMergable, IReducible, does } from './core.js';
import * as t from './transducers.js';

const IEvented = _.protocol({
  on: null,
  chan: null,
  trigger: null
});

const on = IEvented.on;
const chan = IEvented.chan;
const trigger = IEvented.trigger;

function once3(self, key, callback) {
  const off = on(self, key, function (e) {
    off();
    callback.call(this, e);
  });
  return off;
}

function once4(self, key, selector, callback) {
  const off = on(self, key, selector, function (e) {
    off();
    callback.call(this, e);
  });
  return off;
}

const once = _.overload(null, null, null, once3, once4);
const one = _.called(once, "`one` is deprecated.  Use `once` instead.");

const IPublish = _.protocol({
  pub: null,
  err: null,
  complete: null,
  closed: null
});

const pub$3 = IPublish.pub;
const err$3 = IPublish.err;
const complete$3 = IPublish.complete;
const closed$3 = IPublish.closed;

const ISubscribe = protocol({
  sub: null
});

function sub3(source, xf, sink) {
  return ISubscribe.transducing(source, xf, sink);
}

function subN(source) {
  const sink = arguments[arguments.length - 1],
        xfs = _.slice(arguments, 1, arguments.length - 1);

  return ISubscribe.transducing(source, _.comp(...xfs), sink);
}

const sub$4 = _.overload(null, null, ISubscribe.sub, sub3, subN);

var p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  on: on,
  chan: chan,
  trigger: trigger,
  once: once,
  one: one,
  pub: pub$3,
  err: err$3,
  complete: complete$3,
  closed: closed$3,
  sub: sub$4
});

function Observable(subscribe) {
  this.subscribe = subscribe;
}
Observable.prototype[Symbol.toStringTag] = "Observable";
function observable(subscribe) {
  return new Observable(subscribe);
}

function merge(self, other) {
  return observable(function (observer) {
    var _observer, _p$pub, _p;

    const handle = (_p = p, _p$pub = _p.pub, _observer = observer, function pub(_argPlaceholder) {
      return _p$pub.call(_p, _observer, _argPlaceholder);
    });
    return does(sub$4(self, handle), sub$4(other, handle));
  });
}

function reduce(self, f, init) {
  var _self, _f;

  return sub$4(init, (_f = f, _self = self, function f(_argPlaceholder2) {
    return _f(_self, _argPlaceholder2);
  }));
}

const mergable = implement(IMergable, {
  merge
});
const reducible = implement(IReducible, {
  reduce
});

function Subject(observers, terminated) {
  this.observers = observers;
  this.terminated = terminated;
}
Subject.prototype[Symbol.toStringTag] = "Subject";
function subject(observers) {
  return new Subject(_.volatile(observers || []), null);
}
const broadcast = _.called(subject, "`broadcast` deprecated - use `subject` instead.");

function Cell(state, observer, validate) {
  this.state = state;
  this.observer = observer;
  this.validate = validate;
}
Cell.prototype[Symbol.toStringTag] = "Cell";

function cell0() {
  return cell1(null);
}

function cell1(init) {
  return cell2(init, subject());
}

function cell2(init, observer) {
  return cell3(init, observer, null);
}

function cell3(init, observer, validate) {
  return new Cell(init, observer, validate);
}

const cell = _.overload(cell0, cell1, cell2, cell3);

function Observer(pub, err, complete, terminated) {
  this.pub = pub;
  this.err = err;
  this.complete = complete;
  this.terminated = terminated;
}
Observer.prototype[Symbol.toStringTag] = "Observer";
function observer(pub, err, complete) {
  return new Observer(pub || _.noop, err || _.noop, complete || _.noop, null);
}

var _time, _tick, _time2, _when, _hist;

function pipeN(source, ...xforms) {
  return pipe2(source, _.comp(...xforms));
}

function pipe2(source, xform) {
  return observable(function (obs) {
    const step = xform(_.overload(null, _.reduced, function (memo, value) {
      pub$3(memo, value);
      return memo;
    }));
    let unsub = _.noop;
    const sink = observer(function (value) {
      const memo = step(obs, value);

      if (_.isReduced(memo)) {
        complete$3(sink);
      }
    }, function (error) {
      err$3(obs, error);
      unsub();
    }, function () {
      step(obs);
      complete$3(obs);
      unsub();
    });
    unsub = sub$4(source, sink); //might complete before returning `unsub` fn

    if (closed$3(sink)) {
      unsub();
      return _.noop;
    }

    return unsub;
  });
}

const pipe = _.overload(null, _.identity, pipe2, pipeN);

function share1(source) {
  return share2(source, subject());
}

function share2(source, sink) {
  let disconnect = _.noop,
      refs = 0;
  return observable(function (observer) {
    if (refs === 0) {
      disconnect = sub$4(source, sink);
    }

    refs++;
    let unsub = sub$4(sink, observer);
    return _.once(function () {
      refs--;

      if (refs === 0) {
        disconnect();
        disconnect = _.noop;
      }

      unsub();
    });
  });
}

const share = _.overload(null, share1, share2);
function shared(sink, ...fs) {
  var _sink, _sharing;

  return _.comp((_sharing = sharing, _sink = sink, function sharing(_argPlaceholder) {
    return _sharing(_argPlaceholder, _sink);
  }), ...fs);
}
function sharing(source, init) {
  return share(source, init());
}

function seed2(init, source) {
  return observable(function (observer) {
    var _observer, _pub;

    const handle = (_pub = pub$3, _observer = observer, function pub(_argPlaceholder2) {
      return _pub(_observer, _argPlaceholder2);
    });
    handle(init());
    return sub$4(source, handle);
  });
}

function seed1(source) {
  return seed2(_.constantly(null), source);
} //adds an immediate value upon subscription as with cells.


const seed = _.overload(null, seed1, seed2);

function computed$1(f, source) {
  return seed(f, pipe(source, t.map(f)));
}

function interact$1(key, f, el) {
  return computed$1(function () {
    return f(el);
  }, chan(el, key));
}

function indexed(sources) {
  return observable(function (observer) {
    var _param, _$mapIndexed, _ref;

    return _.right(sources, (_ref = _, _$mapIndexed = _ref.mapIndexed, _param = function (key, source) {
      return sub$4(source, function (value) {
        pub$3(observer, {
          key,
          value
        });
      });
    }, function mapIndexed(_argPlaceholder3) {
      return _$mapIndexed.call(_ref, _param, _argPlaceholder3);
    }), _.toArray, _.spread(_.does));
  });
}

function splay1(sources) {
  return splay2(sources, null);
}

function splay2(sources, blank) {
  const source = indexed(sources);
  return observable(function (observer) {
    let state = _.mapa(_.constantly(blank), sources);

    return sub$4(source, function (msg) {
      state = _.assoc(state, msg.key, msg.value);
      pub$3(observer, state);
    });
  });
}

const splay$1 = _.overload(null, splay1, splay2); //sources must publish an initial value immediately upon subscription as cells do.


function latest$1(sources) {
  const nil = {},
        source = splay2(sources, nil);
  return observable(function (observer) {
    let init = false;
    return sub$4(source, function (state) {
      if (init) {
        pub$3(observer, state);
      } else if (!_.includes(state, nil)) {
        init = true;
        pub$3(observer, state);
      }
    });
  });
}

function toggles$1(el, on, off, init) {
  return seed(init, _.merge(pipe(chan(el, on), t.constantly(true)), pipe(chan(el, off), t.constantly(false))));
}

function fixed$1(value) {
  return observable(function (observer) {
    pub$3(observer, value);
    complete$3(observer);
  });
}

function time() {
  return _.date().getTime();
}

function tick2(interval, f) {
  return observable(function (observer) {
    const iv = setInterval(function () {
      pub$3(observer, f());
    }, interval);
    return function () {
      clearInterval(iv);
    };
  });
}

const tick$1 = _.overload(null, (_tick = tick2, _time = time, function tick2(_argPlaceholder4) {
  return _tick(_argPlaceholder4, _time);
}), tick2);

function when2(interval, f) {
  return seed(f, tick$1(interval, f));
}

const when$1 = _.overload(null, (_when = when2, _time2 = time, function when2(_argPlaceholder5) {
  return _when(_argPlaceholder5, _time2);
}), when2);

function map2(f, source) {
  return pipe(source, t.map(f), t.dedupe());
}

function mapN(f, ...sources) {
  return map2(_.spread(f), latest$1(sources));
}

const map$1 = _.overload(null, null, map2, mapN);

function resolve(source) {
  const queue = [];

  function pop(prom, observer) {
    return function (value) {
      if (queue[0] === prom) {
        queue.shift();
        pub$3(observer, value);

        if (queue.length) {
          //drain queue
          queue[0].then(pop(queue[0], observer));
        }
      }
    };
  }

  return observable(function (observer) {
    return sub$4(source, function (value) {
      const prom = Promise.resolve(value);
      queue.push(prom);
      prom.then(pop(prom, observer));
    });
  });
}

function hist2(size, source) {
  return pipe(source, t.hist(size));
}

const hist$1 = _.overload(null, (_hist = hist2, function hist2(_argPlaceholder6) {
  return _hist(2, _argPlaceholder6);
}), hist2);

function fromCollection(coll) {
  return observable(function (observer) {
    for (var item of coll) {
      pub$3(observer, item);

      if (closed$3(observer)) {
        return;
      }
    }

    complete$3(observer);
  });
}

function fromPromise$1(promise) {
  return observable(function (observer) {
    var _observer2, _pub2, _observer3, _err;

    promise.then((_pub2 = pub$3, _observer2 = observer, function pub(_argPlaceholder7) {
      return _pub2(_observer2, _argPlaceholder7);
    }), (_err = err$3, _observer3 = observer, function err(_argPlaceholder8) {
      return _err(_observer3, _argPlaceholder8);
    })).then(function () {
      complete$3(observer);
    });
  });
}

function fromSource(source) {
  var _source, _sub;

  //can be used to cover a source making it readonly
  return observable((_sub = sub$4, _source = source, function sub(_argPlaceholder9) {
    return _sub(_source, _argPlaceholder9);
  }));
}

function toObservable(self) {
  const f = _.satisfies(_.ICoercible, "toObservable", self);

  if (f) {
    return f(self);
  } else if (_.satisfies(ISubscribe, "sub", self)) {
    return fromSource(self);
  } else if (_.satisfies(_.ISequential, self)) {
    return fromCollection(self);
  }
}

_.extend(_.ICoercible, {
  toObservable: null
});

_.doto(Observable, _.implement(_.ICoercible, {
  toObservable: _.identity
}));

_.doto(Promise, _.implement(_.ICoercible, {
  toObservable: fromPromise$1
}));

Object.assign(Observable, {
  latest: latest$1,
  map: map$1,
  hist: hist$1,
  splay: splay$1,
  indexed,
  computed: computed$1,
  fromSource,
  fromEvent: chan,
  fromPromise: fromPromise$1,
  interact: interact$1,
  fixed: fixed$1,
  tick: tick$1,
  when: when$1,
  resolve,
  toggles: toggles$1
});

function sub$3(self, observer) {
  const unsub = self.subscribe(observer) || _.noop;

  return closed$3(observer) ? (unsub(), _.noop) : unsub;
}

const deref$2 = _.called(function deref(self) {
  let value = null;
  sub$4(self, function (val) {
    value = val;
  })(); //immediate unsubscribe

  return value;
}, "Prefer to subscribe to observables rather than `deref` them.");

var behave$4 = _.does(reducible, mergable, _.keying("Observable"), _.implement(_.IDeref, {
  deref: deref$2
}), _.implement(ISubscribe, {
  sub: sub$3
}));

behave$4(Observable);

function pub$2(self, value) {
  if (value !== self.state) {
    if (!self.validate || self.validate(value)) {
      self.state = value;
      pub$3(self.observer, value);
    } else {
      throw new Error("Cell update failed - invalid value.");
    }
  }
}

function err$2(self, observer) {
  err$3(self.observer, observer);
}

const complete$2 = _.noop; //if completed, future subscribes to get the last known value would fail.

function closed$2(self) {
  return closed$3(self.observer);
}

function sub$2(self, observer) {
  pub$3(observer, self.state); //to prime subscriber state

  return sub$4(self.observer, observer); //return unsubscribe fn
}

function deref$1(self) {
  return self.state;
}

function swap$1(self, f) {
  pub$2(self, f(self.state));
}

function dispose(self) {
  _.satisfies(_.IDisposable, self.observer) && _.dispose(self.observer);
}

var behave$3 = _.does(reducible, mergable, _.keying("Cell"), _.implement(_.IDisposable, {
  dispose
}), _.implement(_.IDeref, {
  deref: deref$1
}), _.implement(_.IResettable, {
  reset: pub$2
}), _.implement(_.ISwappable, {
  swap: swap$1
}), _.implement(ISubscribe, {
  sub: sub$2
}), _.implement(IPublish, {
  pub: pub$2,
  err: err$2,
  complete: complete$2,
  closed: closed$2
}));

behave$3(Cell);

function Cursor(source, path) {
  this.source = source;
  this.path = path;
}
Cursor.prototype[Symbol.toStringTag] = "Cursor";
const cursor = _.constructs(Cursor);

function path(self) {
  return self.path;
}

function deref(self) {
  return _.getIn(_.deref(self.source), self.path);
}

function reset(self, value) {
  _.swap(self.source, function (state) {
    return _.assocIn(state, self.path, value);
  });
}

function swap(self, f) {
  _.swap(self.source, function (state) {
    return _.updateIn(state, self.path, f);
  });
}

function sub$1(self, observer) {
  return sub$4(self.source, function (state) {
    pub$3(observer, _.getIn(state, self.path));
  });
}

var behave$2 = _.does(_.keying("Cursor"), //_.implement(_.IDisposable, {dispose}), TODO
_.implement(_.IPath, {
  path
}), _.implement(_.IDeref, {
  deref
}), _.implement(_.IResettable, {
  reset
}), _.implement(_.ISwappable, {
  swap
}), _.implement(ISubscribe, {
  sub: sub$1
}), _.implement(IPublish, {
  pub: reset
}));

behave$2(Cursor);

function pub$1(self, message) {
  if (!self.terminated) {
    return self.pub(message); //unusual for a command but required by transducers
  }
}

function err$1(self, error) {
  if (!self.terminated) {
    self.terminated = {
      how: "error",
      error
    };
    self.err(error);
  }
}

function complete$1(self) {
  if (!self.terminated) {
    self.terminated = {
      how: "complete"
    };
    self.complete();
  }
}

function closed$1(self) {
  return self.terminated;
}

var behave$1 = _.does(_.keying("Observer"), _.implement(IPublish, {
  pub: pub$1,
  err: err$1,
  complete: complete$1,
  closed: closed$1
}));

behave$1(Observer);

function sub(self, observer) {
  if (!self.terminated) {
    var _observer, _$conj, _ref;

    _.vswap(self.observers, (_ref = _, _$conj = _ref.conj, _observer = observer, function conj(_argPlaceholder) {
      return _$conj.call(_ref, _argPlaceholder, _observer);
    }));

    return _.once(function () {
      var _observer2, _$unconj, _ref2;

      _.vswap(self.observers, (_ref2 = _, _$unconj = _ref2.unconj, _observer2 = observer, function unconj(_argPlaceholder2) {
        return _$unconj.call(_ref2, _argPlaceholder2, _observer2);
      }));
    });
  } else {
    throw new Error("Cannot subscribe to a terminated Subject.");
  }
}

function pub(self, message) {
  if (!self.terminated) {
    var _message, _p$pub, _p;

    notify(self, (_p = p, _p$pub = _p.pub, _message = message, function pub(_argPlaceholder3) {
      return _p$pub.call(_p, _argPlaceholder3, _message);
    }));
  }
}

function err(self, error) {
  if (!self.terminated) {
    var _error, _p$err, _p2;

    self.terminated = {
      how: "error",
      error
    };
    notify(self, (_p2 = p, _p$err = _p2.err, _error = error, function err(_argPlaceholder4) {
      return _p$err.call(_p2, _argPlaceholder4, _error);
    }));

    _.vswap(self.observers, _.empty); //release references

  }
}

function complete(self) {
  if (!self.terminated) {
    self.terminated = {
      how: "complete"
    };
    notify(self, complete$3);

    _.vswap(self.observers, _.empty); //release references

  }
}

function closed(self) {
  return self.terminated;
}

function notify(self, f) {
  _.each(f, _.deref(self.observers));
}

var behave = _.does(reducible, mergable, _.keying("Subject"), _.implement(ISubscribe, {
  sub
}), _.implement(IPublish, {
  pub,
  err,
  complete,
  closed
}));

behave(Subject);

var _fromPromise;
function collect(cell) {
  return function (value) {
    var _value, _$conj, _ref;

    //return observer
    _.swap(cell, (_ref = _, _$conj = _ref.conj, _value = value, function conj(_argPlaceholder) {
      return _$conj.call(_ref, _argPlaceholder, _value);
    }));
  };
}

function connect2(source, sink) {
  return sub$4(source, sink);
}

function connect3(source, xform, sink) {
  return sub$4(pipe(source, xform), sink);
}

function connectN(source) {
  const sink = arguments[arguments.length - 1],
        xforms = _.slice(arguments, 1, arguments.length - 1);

  return sub$4(pipe(source, ...xforms), sink);
}

ISubscribe.transducing = connect3;
const connect = _.overload(null, null, connect2, connect3, connectN); //returns `unsub` fn

const map = shared(cell, Observable.map);
const then = shared(cell, Observable.resolve, Observable.map);
const interact = shared(cell, Observable.interact);
const fromEvent = shared(subject, Observable.fromEvent);
const computed = shared(cell, Observable.computed);
const fixed = shared(cell, Observable.fixed);
const latest = shared(cell, Observable.latest);
const splay = shared(cell, Observable.splay);
const tick = shared(subject, Observable.tick);
const when = shared(cell, Observable.when);
const toggles = shared(cell, Observable.toggles);
const hist = shared(cell, Observable.hist);
const readonly = _.called(_.identity, "`readonly` is deprecated.");
const event = _.called(fromEvent, "`event` is deprecated — use `fromEvent` instead.");
const fromElement = _.called(interact, "`fromElement` is deprecated — use `interact` instead.");

function fmap(source, f) {
  return map(f, source);
}

_.each(_.implement(_.IFunctor, {
  fmap
}), [Cell, Subject, Observable]);

function fromPromise2(promise, init) {
  return share(Observable.fromPromise(promise), cell(init));
}

const fromPromise = _.overload(null, (_fromPromise = fromPromise2, function fromPromise2(_argPlaceholder2) {
  return _fromPromise(_argPlaceholder2, null);
}), fromPromise2);
const join = _.called(function join(sink, ...sources) {
  return share(_.merge(...sources), sink);
}, "`join` is deprecated — use `merge` instead."); //enforce sequential nature of operations

function isolate(f) {
  //TODO treat operations as promises
  const queue = [];
  return function () {
    const ready = queue.length === 0;
    queue.push(arguments);

    if (ready) {
      while (queue.length) {
        const args = _.first(queue);

        try {
          f.apply(null, args);
          trigger(args[0], "mutate", {
            bubbles: true
          });
        } finally {
          queue.shift();
        }
      }
    }
  };
}

function mutate3(self, state, f) {
  sub$4(state, _.partial(isolate(f), self));
  return self;
}

function mutate2(state, f) {
  var _state, _f, _mutate;

  return _mutate = mutate3, _state = state, _f = f, function mutate3(_argPlaceholder3) {
    return _mutate(_argPlaceholder3, _state, _f);
  };
}

const mutate = _.called(_.overload(null, null, mutate2, mutate3), "`mutate` is deprecated — use `render` instead.");

function render3(el, obs, f) {
  return sub$4(obs, t.isolate(), function (state) {
    f(el, state);
    trigger(el, "mutate", {
      bubbles: true
    }); //TODO rename
  });
}

function render2(state, f) {
  var _state2, _f2, _render;

  return _render = render3, _state2 = state, _f2 = f, function render3(_argPlaceholder4) {
    return _render(_argPlaceholder4, _state2, _f2);
  };
}

const render = _.overload(null, null, render2, render3);

function renderDiff3(el, obs, f) {
  return sub$4(obs, t.isolate(), t.hist(2), function (history) {
    const args = [el].concat(history);
    f.apply(this, args); //overload arity 2 & 3 for initial and diff rendering

    trigger(el, "mutate", {
      bubbles: true
    }); //TODO rename
  });
}

function renderDiff2(state, f) {
  var _state3, _f3, _renderDiff;

  return _renderDiff = renderDiff3, _state3 = state, _f3 = f, function renderDiff3(_argPlaceholder5) {
    return _renderDiff(_argPlaceholder5, _state3, _f3);
  };
} //TODO replace render after migration


const renderDiff = _.overload(null, null, renderDiff2, renderDiff3);

(function () {

  function pub(self, msg) {
    self(msg);
  }

  _.doto(Function, reducible, //makes fns work as observers like `cell`, e.g. `$.connect($.tick(3000), _.see("foo"))`
  _.implement(IPublish, {
    pub,
    err: _.noop,
    complete: _.noop,
    closed: _.noop
  }));
})();

export { Cell, Cursor, IEvented, IPublish, ISubscribe, Observable, Observer, Subject, broadcast, cell, chan, closed$3 as closed, collect, complete$3 as complete, computed, connect, cursor, err$3 as err, event, fixed, fromElement, fromEvent, fromPromise, hist, interact, join, latest, map, mutate, observable, observer, on, once, one, pipe, pub$3 as pub, readonly, render, renderDiff, seed, share, shared, sharing, splay, sub$4 as sub, subject, then, tick, toObservable, toggles, trigger, when };
