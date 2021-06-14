define(['exports', 'atomic/core', 'symbol', 'atomic/transients', 'atomic/transducers'], function (exports, _, _Symbol, mut, t) { 'use strict';

  var IDispatch = _.protocol({
    dispatch: null
  });

  var dispatch$3 = IDispatch.dispatch;

  function on2(self, f) {
    on3(self, _.identity, f);
  }

  function on3(self, pred, f) {
    if (pred(self)) {
      f(self);
    }
  }

  var on$2 = _.overload(null, null, on2, on3);
  var IEvented = _.protocol({
    on: on$2,
    off: null,
    trigger: null
  });

  var on$1 = IEvented.on;
  var off = IEvented.off;
  var trigger = IEvented.trigger;

  function one3(self, key, callback) {
    function cb(e) {
      off(self, key, ctx.cb);
      callback.call(this, e);
    }

    var ctx = {
      cb: cb
    };
    return on$1(self, key, cb);
  }

  function one4(self, key, selector, callback) {
    function cb(e) {
      off(self, key, ctx.cb);
      callback.call(this, e);
    }

    var ctx = {
      cb: cb
    };
    return on$1(self, key, selector, cb);
  }

  var one = _.overload(null, null, null, one3, one4);

  var IEventProvider = _.protocol({
    raise: null,
    release: null
  });

  var raise$1 = IEventProvider.raise;
  var release$1 = IEventProvider.release;

  var IMiddleware = _.protocol({
    handle: null
  });

  function handle2(self, message) {
    return IMiddleware.handle(self, message, _.noop);
  }

  var handle$4 = _.overload(null, null, handle2, IMiddleware.handle);

  var IPublish = _.protocol({
    pub: null,
    err: null,
    complete: null
  });

  var pub$3 = IPublish.pub;
  var err$3 = IPublish.err;
  var complete$3 = IPublish.complete;

  function deref$5(self) {
    return _.IDeref.deref(self.source);
  }

  function Readonly(source) {
    this.source = source;
  }
  function readonly(source) {
    var obj = new Readonly(source);

    if (_.satisfies(_.IDeref, source)) {
      _.specify(_.IDeref, {
        deref: deref$5
      }, obj);
    }

    return obj;
  }

  var ISubscribe = _.protocol({
    sub: null,
    unsub: null,
    subscribed: null
  });

  function into2(sink, source) {
    return into3(sink, _.identity, source);
  }

  function into3(sink, xf, source) {
    return into4(readonly, sink, xf, source);
  }

  function into4(decorate, sink, xf, source) {
    var observer = _.partial(xf(pub$3), sink);
    ISubscribe.sub(source, observer);

    function dispose(_) {
      ISubscribe.unsub(source, observer);
    }

    return _.doto(decorate(sink), _.specify(_.IDisposable, {
      dispose: dispose
    }));
  }

  function sub3(source, xf, sink) {
    return into4(_.identity, sink, xf, source);
  }

  var into = _.overload(null, null, into2, into3, into4);
  var sub$8 = _.overload(null, null, ISubscribe.sub, sub3);
  var unsub$7 = _.overload(null, null, ISubscribe.unsub);
  var subscribed$7 = ISubscribe.subscribed;

  var ITimeTraveler = _.protocol({
    undo: null,
    redo: null,
    flush: null,
    undoable: null,
    redoable: null
  });

  var undo$1 = ITimeTraveler.undo;
  var undoable$1 = ITimeTraveler.undoable;
  var redo$1 = ITimeTraveler.redo;
  var redoable$1 = ITimeTraveler.redoable;
  var flush$1 = ITimeTraveler.flush;

  function Subject(observers, terminated) {
    this.observers = observers;
    this.terminated = terminated;
  }
  function subject(observers) {
    return new Subject(mut.transient(observers || []), null);
  }
  var broadcast = _.called(subject, "`broadcast` deprecated - use `subject` instead.");

  function Cell(state, observer, validate) {
    this.state = state;
    this.observer = observer;
    this.validate = validate;
  }

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

  var cell = _.overload(cell0, cell1, cell2, cell3);

  function pub$2(self, value) {
    if (value !== self.state) {
      if (!self.validate || self.validate(value)) {
        self.state = value;
        IPublish.pub(self.observer, value);
      } else {
        throw new Error("Cell update failed - invalid value.");
      }
    }
  }

  function err$2(self, observer) {
    IPublish.err(self.observer, observer);
  }

  function complete$2(self) {
    IPublish.complete(self.observer);
  }

  function sub$7(self, observer) {
    IPublish.pub(observer, self.state); //to prime subscriber state

    return ISubscribe.sub(self.observer, observer); //return unsubscribe fn
  }

  function unsub$6(self, observer) {
    ISubscribe.unsub(self.observer, observer);
  }

  function subscribed$6(self) {
    return ISubscribe.subscribed(self.observer);
  }

  function deref$4(self) {
    return self.state;
  }

  function swap$3(self, f) {
    pub$2(self, f(self.state));
  }

  function dispose$2(self) {
    _.satisfies(_.IDisposable, self.observer) && _.IDisposable.dispose(self.observer);
  }

  function reduce$2(self, xf, init) {
    var _self, _xf;

    return ISubscribe.sub(init, (_xf = xf, _self = self, function xf(_argPlaceholder) {
      return _xf(_self, _argPlaceholder);
    }));
  }

  var behaveAsCell = _.does(_.implement(_.IDisposable, {
    dispose: dispose$2
  }), _.implement(_.IReduce, {
    reduce: reduce$2
  }), _.implement(_.IDeref, {
    deref: deref$4
  }), _.implement(ISubscribe, {
    sub: sub$7,
    unsub: unsub$6,
    subscribed: subscribed$6
  }), _.implement(IPublish, {
    pub: pub$2,
    err: err$2,
    complete: complete$2
  }), _.implement(_.IReset, {
    reset: pub$2
  }), _.implement(_.ISwap, {
    swap: swap$3
  }));

  behaveAsCell(Cell);

  function deref$3(self) {
    if (subscribed$7(self) === 0) {
      //force refresh of sink state
      sub$8(self, _.noop);
      unsub$7(self, _.noop);
    }

    return _.IDeref.deref(self.sink);
  }

  function AudienceDetector(sink, state) {
    this.sink = sink;
    this.state = state;
  }

  function audienceDetector2(sink, detected) {
    var init = subscribed$7(sink) === 0 ? "idle" : "active";
    var $state = cell(_.fsm(init, {
      idle: {
        activate: "active"
      },
      active: {
        deactivate: "idle"
      }
    }));
    sub$8($state, _.comp(detected, _.state));
    var result = new AudienceDetector(sink, $state);

    if (_.satisfies(_.IDeref, sink)) {
      _.specify(_.IDeref, {
        deref: deref$3
      }, result);
    }

    return result;
  }

  function audienceDetector3(sink, xf, source) {
    var observer = _.partial(xf(pub$3), sink);
    return audienceDetector2(sink, function (state) {
      var f = state === "active" ? sub$8 : unsub$7;
      f(source, observer);
    });
  }

  var audienceDetector = _.overload(null, null, audienceDetector2, audienceDetector3);

  function sub$6(self, observer) {
    if (subscribed$5(self) === 0) {
      var _transition;

      _.swap(self.state, (_transition = _.transition, function transition(_argPlaceholder) {
        return _transition(_argPlaceholder, "activate");
      }));
    }

    ISubscribe.sub(self.sink, observer);
  }

  function unsub$5(self, observer) {
    ISubscribe.unsub(self.sink, observer);

    if (subscribed$5(self) === 0) {
      var _transition2;

      _.swap(self.state, (_transition2 = _.transition, function transition(_argPlaceholder2) {
        return _transition2(_argPlaceholder2, "deactivate");
      }));
    }
  }

  function subscribed$5(self) {
    return ISubscribe.subscribed(self.sink);
  }

  function dispose$1(self) {
    var _transition3;

    _.swap(self.state, (_transition3 = _.transition, function transition(_argPlaceholder3) {
      return _transition3(_argPlaceholder3, "deactivate");
    }));
  }

  function state(self) {
    return _.IStateMachine.state(IDeref.deref(self.state));
  }

  var behaveAsAudienceDetector = _.does(_.implement(_.IDisposable, {
    dispose: dispose$1
  }), _.implement(_.IStateMachine, {
    state: state
  }), _.implement(ISubscribe, {
    sub: sub$6,
    unsub: unsub$5,
    subscribed: subscribed$5
  }));

  behaveAsAudienceDetector(AudienceDetector);

  function Bus(state, handler) {
    this.state = state;
    this.handler = handler;
  }
  function bus(state, handler) {
    return new Bus(state, handler);
  }

  function dispatch$2(self, command) {
    IMiddleware.handle(self.handler, command);
  }

  function dispose(self) {
    satisfies(_.IDisposable, self.state) && _.IDisposable.dispose(self.state);
    satisfies(_.IDisposable, self.handler) && _.IDisposable.dispose(self.handler);
  }

  var forward = _.forwardTo("state");
  var sub$5 = forward(ISubscribe.sub);
  var unsub$4 = forward(ISubscribe.unsub);
  var subscribed$4 = forward(ISubscribe.subscribed);
  var deref$2 = forward(_.IDeref.deref);
  var reset$2 = forward(_.IReset.reset);
  var swap$2 = forward(_.ISwap.swap);
  var behaveAsBus = _.does(_.implement(_.IDeref, {
    deref: deref$2
  }), _.implement(_.IReset, {
    reset: reset$2
  }), _.implement(_.ISwap, {
    swap: swap$2
  }), _.implement(ISubscribe, {
    sub: sub$5,
    unsub: unsub$4,
    subscribed: subscribed$4
  }), _.implement(IDispatch, {
    dispatch: dispatch$2
  }), _.implement(_.IDisposable, {
    dispose: dispose
  }));

  behaveAsBus(Bus);

  function Cursor(source, path, callbacks) {
    this.source = source;
    this.path = path;
    this.callbacks = callbacks;
  }
  function cursor(source, path) {
    return new Cursor(source, path, _.weakMap());
  }

  function path(self) {
    return self.path;
  }

  function deref$1(self) {
    return _.getIn(_.deref(self.source), self.path);
  }

  function reset$1(self, value) {
    _.swap(self.source, function (state) {
      return _.assocIn(state, self.path, value);
    });
  }

  function swap$1(self, f) {
    _.swap(self.source, function (state) {
      return _.updateIn(state, self.path, f);
    });
  }

  function sub$4(self, observer) {
    function observe(state) {
      IPublish.pub(observer, _.getIn(state, self.path));
    }

    self.callbacks.set(observer, observe);

    sub$8(self.source, observe);
  }

  function unsub$3(self, observer) {
    var observe = self.callbacks.get(observer);

    unsub$7(self.source, observe);

    observe && self.callbacks["delete"](observer);
  }

  function subscribed$3(self) {
    return _.ICounted.count(self.callbacks);
  }

  function dispatch$1(self, command) {
    IDispatch.dispatch(self.source, _.update(command, "path", function (path) {
      return _.apply(_.conj, self.path, path || []);
    }));
  }

  var behaveAsCursor = _.does( //implement(IDisposable, {dispose}), TODO
  _.implement(_.IPath, {
    path: path
  }), _.implement(IDispatch, {
    dispatch: dispatch$1
  }), _.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(ISubscribe, {
    sub: sub$4,
    unsub: unsub$3,
    subscribed: subscribed$3
  }), _.implement(IPublish, {
    pub: reset$1
  }), _.implement(_.IReset, {
    reset: reset$1
  }), _.implement(_.ISwap, {
    swap: swap$1
  }));

  behaveAsCursor(Cursor);

  function Events(queued) {
    this.queued = queued;
  }
  function events() {
    return new Events([]);
  }

  function raise(self, event) {
    self.queued.push(event);
  }

  function release(self) {
    var released = self.queued;
    self.queued = [];
    return released;
  }

  var behaveAsEvents = _.does(_.implement(IEventProvider, {
    raise: raise,
    release: release
  }));

  behaveAsEvents(Events);

  function EventDispatcher(events, bus, observer) {
    this.events = events;
    this.bus = bus;
    this.observer = observer;
  }
  function eventDispatcher(events, bus, observer) {
    return new EventDispatcher(events, bus, observer);
  }

  function handle$3(self, command, next) {
    next(command);
    _.each(function (event) {
      handle$4(self.bus, event);

      pub$3(self.observer, event);
    }, release$1(self.events));
  }

  var behaveAsEventDispatcher = _.does(_.implement(IMiddleware, {
    handle: handle$3
  }));

  behaveAsEventDispatcher(EventDispatcher);

  function MessageHandler(handlers, fallback) {
    this.handlers = handlers;
    this.fallback = fallback;
  }
  function messageHandler(handlers, fallback) {
    return new MessageHandler(handlers, fallback);
  }

  function handle$2(self, command, next) {
    var type = _.ILookup.lookup(command, "type");
    var handler = _.ILookup.lookup(self.handlers, type) || self.fallback;
    IMiddleware.handle(handler, command, next);
  }

  var behaveAsMessageHandler = _.does(_.implement(IMiddleware, {
    handle: handle$2
  }));

  behaveAsMessageHandler(MessageHandler);

  function MessageProcessor(action) {
    this.action = action;
  }
  function messageProcessor(action) {
    return new MessageProcessor(action);
  }

  function handle$1(self, message, next) {
    self.action(message);
    next(message);
  }

  var behaveAsMessageProcessor = _.does(_.implement(IMiddleware, {
    handle: handle$1
  }));

  behaveAsMessageProcessor(MessageProcessor);

  function Middleware(handlers) {
    this.handlers = handlers;
  }
  function middleware(handlers) {
    var _conj, _handlers, _apply;

    return _.doto(new Middleware(handlers || []), (_apply = _.apply, _conj = _.conj, _handlers = handlers, function apply(_argPlaceholder) {
      return _apply(_conj, _argPlaceholder, _handlers);
    }));
  }

  function handles(handle) {
    return _.doto({}, _.specify(IMiddleware, {
      handle: handle
    }));
  }

  function accepts(events, type) {
    var raise = _.partial(IEventProvider.raise, events);
    return handles(function (_$1, command, next) {
      raise(_.assoc(command, "type", type));
      next(command);
    });
  }

  function raises(events, bus, callback) {
    var raise = _.partial(IEventProvider.raise, events);
    return handles(function (_, command, next) {
      callback(bus, command, next, raise);
    });
  }

  function affects3(bus, f, react) {
    return handles(function (_$1, event, next) {
      var _event$path, _getIn;

      var past = _.deref(bus),
          present = event.path ? _.apply(_.updateIn, past, event.path, f, event.args) : _.apply(f, past, event.args),
          scope = event.path ? (_getIn = _.getIn, _event$path = event.path, function getIn(_argPlaceholder) {
        return _getIn(_argPlaceholder, _event$path);
      }) : _.identity;
      _.reset(bus, present);
      react(bus, event, scope(present), scope(past));
      next(event);
    });
  }

  function affects2(bus, f) {
    return affects3(bus, f, _.noop);
  }

  var affects = _.overload(null, null, affects2, affects3);

  function component2(state, callback) {
    var evts = events(),
        ware = middleware(),
        observer = subject();
    return _.doto(bus(state, ware), function ($bus) {
      var maps = callback(_.partial(accepts, evts), _.partial(raises, evts, $bus), _.partial(affects, $bus));
      var commandMap = maps[0],
          eventMap = maps[1];
      mut.conj(ware, messageHandler(commandMap), eventDispatcher(evts, messageHandler(eventMap), observer));
    });
  }

  function component1(state) {
    return component2(state, function () {
      return [{}, {}]; //static components may lack commands that drive state change.
    });
  }

  var component = _.overload(null, component1, component2);

  function conj$1(self, handler) {
    self.handlers = _.ICollection.conj(self.handlers, handler);
    self.handler = combine(self.handlers);
  }

  function combine(handlers) {
    var f = _.reduce(function (memo, handler) {
      return function (command) {
        return IMiddleware.handle(handler, command, memo);
      };
    }, _.noop, _.reverse(handlers));

    function handle(_, command) {
      return f(command);
    }

    return _.doto({}, _.specify(IMiddleware, {
      handle: handle
    }));
  }

  function handle(self, command, next) {
    IMiddleware.handle(self.handler, command, next);
  }

  var behaveAsMiddleware = _.does(_.implement(mut.ITransientCollection, {
    conj: conj$1
  }), _.implement(IMiddleware, {
    handle: handle
  }));

  behaveAsMiddleware(Middleware);

  function Observer(pub, err, complete, terminated) {
    this.pub = pub;
    this.err = err;
    this.complete = complete;
    this.terminated = terminated;
  }
  function observer(pub, err, complete) {
    return new Observer(pub || _.noop, err || _.noop, complete || _.noop, null);
  }
  function observe(pub, obs) {
    var _obs, _IPublish$err, _IPublish;

    return observer(pub, (_IPublish = IPublish, _IPublish$err = _IPublish.err, _obs = obs, function err(_argPlaceholder) {
      return _IPublish$err.call(_IPublish, _obs, _argPlaceholder);
    }), function () {
      IPublish.complete(obs);
    });
  }

  function Observable(subscribed) {
    this.subscribed = subscribed;
  }
  function observable(subscribed) {
    return new Observable(subscribed);
  }
  function pipe(source, xf) {
    for (var _len = arguments.length, xfs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      xfs[_key - 2] = arguments[_key];
    }

    var xform = xfs.length ? _.comp.apply(void 0, [xf].concat(xfs)) : xf,
        step = xform(pub$3);
    return observable(function (observer) {
      var obs = observe(function (value) {
        var memo = step(observer, value);

        if (_.isReduced(memo)) {
          complete$3(obs);
        }

        return observer;
      }, observer);
      return sub$8(source, obs);
    });
  }

  function from(coll) {
    return observable(function (observer) {
      var _observer, _pub;

      _.each((_pub = pub$3, _observer = observer, function pub(_argPlaceholder) {
        return _pub(_observer, _argPlaceholder);
      }), coll);
      complete$3(observer);
    });
  }

  function fromPromise$1(promise) {
    return observable(function (observer) {
      promise.then(function (value) {
        pub$3(observer, val);
        complete$3(observer);
      })["catch"](function (error) {
        err$3(observer, error);
        complete$3(observer);
      });
    });
  }

  function fromEvent(el, key) {
    return observable(function (observer) {
      var _observer2, _pub2;

      var handler = (_pub2 = pub$3, _observer2 = observer, function pub(_argPlaceholder2) {
        return _pub2(_observer2, _argPlaceholder2);
      });
      el.addEventListener(key, handler);
      return function () {
        el.removeEventListener(key, handler);
      };
    });
  }
  Observable.fromEvent = fromEvent;
  Observable.fromPromise = fromPromise$1;
  Observable.from = from;
  Observable.pipe = pipe;

  function sub$3(self, observer) {
    return self.subscribed(observer); //return unsubscribe fn
  }

  function reduce$1(self, xf, init) {
    var _self, _xf;

    return ISubscribe.sub(init, (_xf = xf, _self = self, function xf(_argPlaceholder) {
      return _xf(_self, _argPlaceholder);
    }));
  }

  var behaveAsObservable = _.does(_.implement(_.IReduce, {
    reduce: reduce$1
  }), _.implement(ISubscribe, {
    sub: sub$3
  }));

  behaveAsObservable(Observable);

  function pub$1(self, message) {
    if (!self.terminated) {
      return self.pub(message); //unusual for a command but required by transducers
    }
  }

  function err$1(self, error) {
    if (!self.terminated) {
      self.terminated = {
        how: "error",
        error: error
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

  var behaveAsObserver = _.does(_.implement(IPublish, {
    pub: pub$1,
    err: err$1,
    complete: complete$1
  }));

  behaveAsObserver(Observer);

  function sub$2(self, observer) {
    ISubscribe.sub(self.source, observer);
  }

  function unsub$2(self, observer) {
    ISubscribe.unsub(self.source, observer);
  }

  function subscribed$2(self) {
    return ISubscribe.subscribed(self.source);
  }

  var behaveAsReadonly = _.does(_.implement(ISubscribe, {
    sub: sub$2,
    unsub: unsub$2,
    subscribed: subscribed$2
  }));

  behaveAsReadonly(Readonly);

  function Router(fallback, handlers, receives) {
    this.fallback = fallback;
    this.handlers = handlers;
    this.receives = receives;
  }

  function router3(fallback, handlers, receives) {
    return new Router(fallback, handlers, receives);
  }

  function router2(fallback, handlers) {
    return router3(fallback, handlers, _.first);
  }

  function router1(fallback) {
    return router2(fallback, []);
  }

  function router0() {
    return router1(null);
  }

  var router = _.overload(router0, router1, router2, router3);
  Router.from = router;

  function handler3(pred, callback, how) {
    var _pred, _how, _callback, _how2;

    return handler2((_how = how, _pred = pred, function how(_argPlaceholder) {
      return _how(_pred, _argPlaceholder);
    }), (_how2 = how, _callback = callback, function how(_argPlaceholder2) {
      return _how2(_callback, _argPlaceholder2);
    }));
  }

  function handler2(pred, callback) {
    function matches(_, message) {
      return pred(message);
    }

    function dispatch(_, message) {
      return callback(message);
    }

    return _.doto({
      pred: pred,
      callback: callback
    }, _.specify(_.IMatchable, {
      matches: matches
    }), _.specify(IDispatch, {
      dispatch: dispatch
    }));
  }

  var handler = _.overload(null, null, handler2, handler3);

  function on(self, pred, callback) {
    conj(self, handler(pred, callback));
  }

  function dispatch(self, message) {
    var receiver = self.receives(matches(self, message));

    if (!receiver) {
      throw new Error("No receiver for message.");
    }

    return IDispatch.dispatch(receiver, message);
  }

  function matches(self, message) {
    var _message, _IMatchable$matches, _IMatchable;

    var xs = _.filter((_IMatchable = _.IMatchable, _IMatchable$matches = _IMatchable.matches, _message = message, function matches(_argPlaceholder) {
      return _IMatchable$matches.call(_IMatchable, _argPlaceholder, _message);
    }), self.handlers);
    return _.ISeqable.seq(xs) ? xs : self.fallback ? [self.fallback] : [];
  }

  function conj(self, handler) {
    self.handlers = _.IAppendable.append(self.handlers, handler);
  }

  var behaveAsRouter = _.does(_.implement(IEvented, {
    on: on
  }), _.implement(IDispatch, {
    dispatch: dispatch
  }), _.implement(_.IMatchable, {
    matches: matches
  }), _.implement(mut.ITransientCollection, {
    conj: conj
  }));

  behaveAsRouter(Router);

  function sub$1(self, observer) {
    if (!self.terminated) {
      mut.conj(self.observers, observer);
      return _.once(function () {
        unsub$1(self, observer);
      });
    } else {
      throw new Error("Cannot subscribe to a terminated Subject.");
    }
  }

  function unsub$1(self, observer) {
    mut.unconj(self.observers, observer);
  }

  function subscribed$1(self) {
    return _.ICounted.count(self.observers);
  }

  function pub(self, message) {
    if (!self.terminated) {
      var _message, _IPublish$pub, _IPublish;

      notify(self, (_IPublish = IPublish, _IPublish$pub = _IPublish.pub, _message = message, function pub(_argPlaceholder) {
        return _IPublish$pub.call(_IPublish, _argPlaceholder, _message);
      }));
    }
  }

  function err(self, error) {
    if (!self.terminated) {
      var _error, _IPublish$err, _IPublish2;

      self.terminated = {
        how: "error",
        error: error
      };
      notify(self, (_IPublish2 = IPublish, _IPublish$err = _IPublish2.err, _error = error, function err(_argPlaceholder2) {
        return _IPublish$err.call(_IPublish2, _argPlaceholder2, _error);
      }));
      self.observers = null; //release references
    }
  }

  function complete(self) {
    if (!self.terminated) {
      self.terminated = {
        how: "complete"
      };
      notify(self, IPublish.complete);
      self.observers = null; //release references
    }
  } //copying prevents midstream changes to observers


  function notify(self, f) {
    _.each(f, _.clone(self.observers));
  }

  function reduce(self, xf, init) {
    var _self, _xf;

    return ISubscribe.sub(init, (_xf = xf, _self = self, function xf(_argPlaceholder3) {
      return _xf(_self, _argPlaceholder3);
    })); //TODO implement `sub` on arrays?
  }

  var behaveAsSubject = _.does(_.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(ISubscribe, {
    sub: sub$1,
    unsub: unsub$1,
    subscribed: subscribed$1
  }), _.implement(IPublish, {
    pub: pub,
    err: err,
    complete: complete
  }));

  behaveAsSubject(Subject);

  function TimeTraveler(pos, max, history, cell) {
    this.pos = pos;
    this.max = max;
    this.history = history;
    this.cell = cell;
  }

  function timeTraveler2(max, cell) {
    return new TimeTraveler(0, max, [_.deref(cell)], cell);
  }

  function timeTraveler1(cell) {
    return timeTraveler2(Infinity, cell);
  }

  var timeTraveler = _.overload(null, timeTraveler1, timeTraveler2);

  function deref(self) {
    return _.IDeref.deref(self.cell);
  }

  function reset(self, state) {
    var history = self.pos ? self.history.slice(self.pos) : self.history;
    history.unshift(state);

    while (_.ICounted.count(history) > self.max) {
      history.pop();
    }

    self.history = history;
    self.pos = 0;
    _.IReset.reset(self.cell, state);
  }

  function swap(self, f) {
    reset(self, f(_.IDeref.deref(self.cell)));
  }

  function sub(self, observer) {
    ISubscribe.sub(self.cell, observer);
  }

  function unsub(self, observer) {
    ISubscribe.unsub(self.cell, observer);
  }

  function subscribed(self) {
    return ISubscribe.subscribed(self.cell);
  }

  function undo(self) {
    if (undoable(self)) {
      self.pos += 1;
      _.IReset.reset(self.cell, self.history[self.pos]);
    }
  }

  function redo(self) {
    if (redoable(self)) {
      self.pos -= 1;
      _.IReset.reset(self.cell, self.history[self.pos]);
    }
  }

  function flush(self) {
    self.history = [self.history[self.pos]];
    self.pos = 0;
  }

  function undoable(self) {
    return self.pos < _.ICounted.count(self.history);
  }

  function redoable(self) {
    return self.pos > 0;
  }

  var behaveAsTimeTraveler = _.does(_.implement(ITimeTraveler, {
    undo: undo,
    redo: redo,
    flush: flush,
    undoable: undoable,
    redoable: redoable
  }), _.implement(_.IDeref, {
    deref: deref
  }), _.implement(_.IReset, {
    reset: reset
  }), _.implement(_.ISwap, {
    swap: swap
  }), _.implement(ISubscribe, {
    sub: sub,
    unsub: unsub,
    subscribed: subscribed
  }));

  behaveAsTimeTraveler(TimeTraveler);

  function then2(f, source) {
    var sink = cell(null);

    function observe(value) {
      _.IFunctor.fmap(_.Promise.resolve(f(value)), _.partial(pub$3, sink));
    }

    function dispose(self) {
      ISubscribe.unsub(source, observe);
    }

    ISubscribe.sub(source, observe);
    return _.doto(readonly(sink), _.specify(_.IDisposable, {
      dispose: dispose
    }));
  }

  function thenN(f) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    return then2(_.spread(f), latest(sources));
  }

  var then = _.overload(null, null, then2, thenN);

  function signal1(source) {
    return signal2(t.map(_.identity), source);
  }

  function signal2(xf, source) {
    return signal3(xf, null, source);
  }

  function signal3(xf, init, source) {
    return signal4(audienceDetector, xf, init, source);
  }

  function signal4(into, xf, init, source) {
    return into(cell(init), xf, source);
  }

  var signal = _.overload(null, signal1, signal2, signal3, signal4);

  function sink(source) {
    return _.satisfies(_.IDeref, source) ? cell() : subject();
  }

  function via2(xf, source) {
    return into(sink(source), xf, source);
  }

  function viaN(xf) {
    for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    return via2(_.spread(xf), latest(sources));
  }

  var via = _.overload(null, null, via2, viaN);

  function connect2(source, sink) {
    return connect3(source, t.identity(), sink);
  }

  function connect3(source, xform, sink) {
    return _.transduce(xform, IPublish.pub, source, sink);
  }

  var connect = _.overload(null, null, connect2, connect3); //successor to `via`, returns `disconnect` fn

  function map2(f, source) {
    return via2(_.comp(t.map(f), t.dedupe()), source);
  }

  function mapN(f) {
    for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      sources[_key3 - 1] = arguments[_key3];
    }

    return map2(_.spread(f), latest(sources));
  }

  var map = _.overload(null, null, map2, mapN);
  function computed(f, source) {
    var sink = cell(f(source));

    function callback() {
      _.IReset.reset(sink, f(source));
    }

    function pub(self, value) {
      IPublish.pub(source, value);
    }

    return _.doto(audienceDetector(sink, function (state) {
      var f = state == "active" ? ISubscribe.sub : ISubscribe.unsub;
      f(source, callback);
    }), _.specify(IPublish, {
      pub: pub
    }));
  }

  function fmap(source, f) {
    return map(f, source);
  }

  _.each(_.implement(_.IFunctor, {
    fmap: fmap
  }), [AudienceDetector, Cell, Subject]);
  function mousemove(el) {
    return signal(t.map(function (e) {
      return [e.clientX, e.clientY];
    }), [], event(el, "mouseenter mousemove"));
  }
  function keydown(el) {
    return signal(event(el, "keydown"));
  }
  function keyup(el) {
    return signal(event(el, "keyup"));
  }
  function keypress(el) {
    return signal(event(el, "keypress"));
  }
  function scan(f, init, source) {
    var memo = init;
    return signal(t.map(function (value) {
      memo = f(memo, value);
      return memo;
    }), init, source);
  }
  function pressed(el) {
    return signal(t.dedupe(), [], scan(function (memo, value) {
      if (value.type === "keyup") {
        memo = _.filtera(_.partial(_.notEq, value.key), memo);
      } else if (memo.indexOf(value.key) === -1) {
        memo = _.ICollection.conj(memo, value.key);
      }

      return memo;
    }, [], join(subject(), keydown(el), keyup(el))));
  }
  function hashchange(window) {
    return signal(t.map(function () {
      return location.hash;
    }), location.hash, event(window, "hashchange"));
  }

  function fromPromise1(promise) {
    return fromPromise2(promise, null);
  }

  function fromPromise2(promise, init) {
    var _sink, _IPublish$pub, _IPublish;

    var sink = cell(init);
    _.IFunctor.fmap(promise, (_IPublish = IPublish, _IPublish$pub = _IPublish.pub, _sink = sink, function pub(_argPlaceholder) {
      return _IPublish$pub.call(_IPublish, _sink, _argPlaceholder);
    }));
    return sink;
  }

  var fromPromise = _.overload(null, fromPromise1, fromPromise2);
  function fromElement(events, f, el) {
    return signal(t.map(function () {
      return f(el);
    }), f(el), event(el, events));
  }
  function focus(el) {
    return join(cell(el === document.activeElement), via(t.map(_.constantly(true)), event(el, "focus")), via(t.map(_.constantly(false)), event(el, "blur")));
  }
  function join(sink) {
    var _sink2, _IPublish$pub2, _IPublish2;

    for (var _len4 = arguments.length, sources = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      sources[_key4 - 1] = arguments[_key4];
    }

    var callback = (_IPublish2 = IPublish, _IPublish$pub2 = _IPublish2.pub, _sink2 = sink, function pub(_argPlaceholder2) {
      return _IPublish$pub2.call(_IPublish2, _sink2, _argPlaceholder2);
    });
    return audienceDetector(sink, function (state) {
      var _callback, _f;

      var f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
      _.each((_f = f, _callback = callback, function f(_argPlaceholder3) {
        return _f(_argPlaceholder3, _callback);
      }), sources);
    });
  }
  var fixed = _.comp(readonly, cell);
  function latest(sources) {
    var sink = cell(_.mapa(_.constantly(null), sources));
    var fs = _.memoize(function (idx) {
      return function (value) {
        var _idx, _value, _IAssociative$assoc, _IAssociative;

        _.ISwap.swap(sink, (_IAssociative = _.IAssociative, _IAssociative$assoc = _IAssociative.assoc, _idx = idx, _value = value, function assoc(_argPlaceholder4) {
          return _IAssociative$assoc.call(_IAssociative, _argPlaceholder4, _idx, _value);
        }));
      };
    }, _.str);
    return audienceDetector(sink, function (state) {
      var f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
      _.doall(_.mapIndexed(function (idx, source) {
        f(source, fs(idx));
      }, sources));
    });
  }

  function hist2(size, source) {
    var sink = cell([]);
    var history = [];
    ISubscribe.sub(source, function (value) {
      history = _.slice(history);
      history.unshift(value);

      if (history.length > size) {
        history.pop();
      }

      IPublish.pub(sink, history);
    });
    return sink;
  }

  var hist = _.overload(null, _.partial(hist2, 2), hist2);

  function event2(el, key) {
    var sink = subject(),
        callback = _.partial(IPublish.pub, sink);
    return audienceDetector(sink, function (status) {
      var f = status === "active" ? on$1 : off;
      f(el, key, callback);
    });
  }

  function event3(el, key, selector) {
    var sink = subject(),
        callback = _.partial(IPublish.pub, sink);
    return audienceDetector(sink, function (status) {
      if (status === "active") {
        on$1(el, key, selector, callback);
      } else {
        off(el, key, callback);
      }
    });
  }

  var event = _.called(_.overload(null, null, event2, event3), "`event` deprecated - use `fromEvent` instead.");
  function click(el) {
    return event(el, "click");
  } //enforce sequential nature of operations

  function isolate(f) {
    //TODO treat operations as promises
    var queue = [];
    return function () {
      var ready = queue.length === 0;
      queue.push(arguments);

      if (ready) {
        while (queue.length) {
          var args = _.first(queue);

          try {
            f.apply(null, args);
            IEvented.trigger(args[0], "mutate", {
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
    ISubscribe.sub(state, _.partial(isolate(f), self));
    return self;
  }

  function mutate2(state, f) {
    var _state, _f2, _mutate;

    return _mutate = mutate3, _state = state, _f2 = f, function mutate3(_argPlaceholder5) {
      return _mutate(_argPlaceholder5, _state, _f2);
    };
  }

  var mutate = _.overload(null, null, mutate2, mutate3);

  (function () {
    function dispatch(self, args) {
      return _.apply(self, args);
    }

    function pub(self, msg) {
      self(msg);
    }

    _.doto(Function, _.implement(IPublish, {
      pub: pub,
      err: _.noop,
      complete: _.noop
    }), _.implement(IDispatch, {
      dispatch: dispatch
    }));
  })();

  exports.AudienceDetector = AudienceDetector;
  exports.Bus = Bus;
  exports.Cell = Cell;
  exports.Cursor = Cursor;
  exports.EventDispatcher = EventDispatcher;
  exports.Events = Events;
  exports.IDispatch = IDispatch;
  exports.IEventProvider = IEventProvider;
  exports.IEvented = IEvented;
  exports.IMiddleware = IMiddleware;
  exports.IPublish = IPublish;
  exports.ISubscribe = ISubscribe;
  exports.ITimeTraveler = ITimeTraveler;
  exports.MessageHandler = MessageHandler;
  exports.MessageProcessor = MessageProcessor;
  exports.Middleware = Middleware;
  exports.Observable = Observable;
  exports.Observer = Observer;
  exports.Readonly = Readonly;
  exports.Router = Router;
  exports.Subject = Subject;
  exports.TimeTraveler = TimeTraveler;
  exports.affects = affects;
  exports.audienceDetector = audienceDetector;
  exports.broadcast = broadcast;
  exports.bus = bus;
  exports.cell = cell;
  exports.click = click;
  exports.complete = complete$3;
  exports.component = component;
  exports.computed = computed;
  exports.connect = connect;
  exports.cursor = cursor;
  exports.dispatch = dispatch$3;
  exports.err = err$3;
  exports.event = event;
  exports.eventDispatcher = eventDispatcher;
  exports.events = events;
  exports.fixed = fixed;
  exports.flush = flush$1;
  exports.focus = focus;
  exports.fromElement = fromElement;
  exports.fromEvent = fromEvent;
  exports.fromPromise = fromPromise;
  exports.handle = handle$4;
  exports.handler = handler;
  exports.handles = handles;
  exports.hashchange = hashchange;
  exports.hist = hist;
  exports.into = into;
  exports.join = join;
  exports.keydown = keydown;
  exports.keypress = keypress;
  exports.keyup = keyup;
  exports.latest = latest;
  exports.map = map;
  exports.messageHandler = messageHandler;
  exports.messageProcessor = messageProcessor;
  exports.middleware = middleware;
  exports.mousemove = mousemove;
  exports.mutate = mutate;
  exports.observable = observable;
  exports.observe = observe;
  exports.observer = observer;
  exports.off = off;
  exports.on = on$1;
  exports.one = one;
  exports.pipe = pipe;
  exports.pressed = pressed;
  exports.pub = pub$3;
  exports.raise = raise$1;
  exports.readonly = readonly;
  exports.redo = redo$1;
  exports.redoable = redoable$1;
  exports.release = release$1;
  exports.router = router;
  exports.scan = scan;
  exports.signal = signal;
  exports.sub = sub$8;
  exports.subject = subject;
  exports.subscribed = subscribed$7;
  exports.then = then;
  exports.then2 = then2;
  exports.timeTraveler = timeTraveler;
  exports.trigger = trigger;
  exports.undo = undo$1;
  exports.undoable = undoable$1;
  exports.unsub = unsub$7;
  exports.via = via;

  Object.defineProperty(exports, '__esModule', { value: true });

});
