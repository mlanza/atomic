import * as _ from './core.js';
import { protocol } from './core.js';
import * as $ from './reactives.js';
import * as mut from './transients.js';

const IDispatch = _.protocol({
  dispatch: null
});

const dispatch$2 = IDispatch.dispatch;

const IEventProvider = _.protocol({
  raise: null,
  release: null
});

const raise$1 = IEventProvider.raise;
const release$1 = IEventProvider.release;

const IMiddleware = protocol({
  handle: null
});

function handle2(self, message) {
  return IMiddleware.handle(self, message, _.noop);
}

const handle$a = _.overload(null, null, handle2, IMiddleware.handle);

var p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  dispatch: dispatch$2,
  raise: raise$1,
  release: release$1,
  handle: handle$a
});

function Bus(state, handler) {
  this.state = state;
  this.handler = handler;
}
Bus.prototype[Symbol.toStringTag] = "Bus";
function bus(state, handler) {
  return new Bus(state, handler);
}

function dispatch$1(self, command) {
  handle$a(self.handler, command);
}

function dispose(self) {
  _.satisfies(_.IDisposable, self.state) && _.dispose(self.state);
  _.satisfies(_.IDisposable, self.handler) && _.dispose(self.handler);
}

var behave$d = _.does(_.keying("Bus"), _.forward("state", $.ISubscribe, _.IDeref, _.IResettable, _.ISwappable, _.IReducible), _.implement(IDispatch, {
  dispatch: dispatch$1
}), _.implement(_.IDisposable, {
  dispose
}));

behave$d(Bus);

function Events(queued) {
  this.queued = queued;
}
Events.prototype[Symbol.toStringTag] = "Events";
function events() {
  return new Events([]);
}

function raise(self, event) {
  self.queued.push(event);
}

function release(self) {
  const released = self.queued;
  self.queued = [];
  return released;
}

var behave$c = _.does(_.keying("Events"), _.implement(IEventProvider, {
  raise,
  release
}));

behave$c(Events);

function EventDispatcher(events, bus, observer) {
  this.events = events;
  this.bus = bus;
  this.observer = observer;
}
EventDispatcher.prototype[Symbol.toStringTag] = "EventDispatcher";
function eventDispatcher(events, bus, observer) {
  return new EventDispatcher(events, bus, observer);
}

function handle$9(self, command, next) {
  next(command);

  _.each(function (event) {
    handle$a(self.bus, event);
    $.pub(self.observer, event);
  }, release$1(self.events));
}

var behave$b = _.does(_.keying("EventDispatcher"), _.implement(IMiddleware, {
  handle: handle$9
}));

behave$b(EventDispatcher);

function MessageHandler(handlers, fallback) {
  this.handlers = handlers;
  this.fallback = fallback;
}
MessageHandler.prototype[Symbol.toStringTag] = "MessageHandler";
function messageHandler(handlers, fallback) {
  return new MessageHandler(handlers, fallback);
}

function handle$8(self, command, next) {
  const type = _.get(command, "type");

  const handler = _.get(self.handlers, type, self.fallback);

  handle$a(handler, command, next);
}

var behave$a = _.does(_.keying("MessageHandler"), _.implement(IMiddleware, {
  handle: handle$8
}));

behave$a(MessageHandler);

function MessageProcessor(action) {
  this.action = action;
}
MessageProcessor.prototype[Symbol.toStringTag] = "MessageProcessor";
function messageProcessor(action) {
  return new MessageProcessor(action);
}

function handle$7(self, message, next) {
  self.action(message);
  next(message);
}

var behave$9 = _.does(_.keying("MessageProcessor"), _.implement(IMiddleware, {
  handle: handle$7
}));

behave$9(MessageProcessor);

function Middleware(handlers) {
  this.handlers = handlers;
}
Middleware.prototype[Symbol.toStringTag] = "Middleware";
function middleware(handlers) {
  var _$conj, _handlers, _$apply, _ref;

  return _.doto(new Middleware(handlers || []), (_ref = _, _$apply = _ref.apply, _$conj = _.conj, _handlers = handlers, function apply(_argPlaceholder) {
    return _$apply.call(_ref, _$conj, _argPlaceholder, _handlers);
  }));
}

function handles(handle) {
  return _.doto({}, _.specify(IMiddleware, {
    handle
  }));
}

function accepts(events, type) {
  const raise = _.partial(raise$1, events);

  return handles(function (x, command, next) {
    raise(_.assoc(command, "type", type));
    next(command);
  });
}

function raises(events, bus, callback) {
  const raise = _.partial(raise$1, events);

  return handles(function (x, command, next) {
    callback(bus, command, next, raise);
  });
}

function affects3(bus, f, react) {
  return handles(function (x, event, next) {
    var _event$path, _$getIn, _ref;

    const past = _.deref(bus),
          present = event.path ? _.apply(_.updateIn, past, event.path, f, event.args) : _.apply(f, past, event.args),
          scope = event.path ? (_ref = _, _$getIn = _ref.getIn, _event$path = event.path, function getIn(_argPlaceholder) {
      return _$getIn.call(_ref, _argPlaceholder, _event$path);
    }) : _.identity;

    _.reset(bus, present);

    react(bus, event, scope(present), scope(past));
    next(event);
  });
}

function affects2(bus, f) {
  return affects3(bus, f, _.noop);
}

const affects = _.overload(null, null, affects2, affects3);

function component2(state, callback) {
  const evts = events(),
        ware = middleware(),
        observer = $.subject();
  return _.doto(bus(state, ware), function ($bus) {
    const maps = callback(_.partial(accepts, evts), _.partial(raises, evts, $bus), _.partial(affects, $bus));
    const commandMap = maps[0],
          eventMap = maps[1];
    mut.conj(ware, messageHandler(commandMap), eventDispatcher(evts, messageHandler(eventMap), observer));
  });
}

function component1(state) {
  return component2(state, function () {
    return [{}, {}]; //static components may lack commands that drive state change.
  });
}

const component = _.overload(null, component1, component2);

function conj$1(self, handler) {
  self.handlers = _.conj(self.handlers, handler);
  self.handler = combine(self.handlers);
}

function combine(handlers) {
  const f = _.reduce(function (memo, handler) {
    return function (command) {
      return handle$a(handler, command, memo);
    };
  }, _.noop, _.reverse(handlers));

  function handle(x, command) {
    return f(command);
  }

  return _.doto({}, _.specify(IMiddleware, {
    handle
  }));
}

function handle$6(self, command, next) {
  handle$a(self.handler, command, next);
}

var behave$8 = _.does(_.keying("Middleware"), _.implement(mut.ITransientCollection, {
  conj: conj$1
}), _.implement(IMiddleware, {
  handle: handle$6
}));

behave$8(Middleware);

function MessageBus(middlewares) {
  this.middlewares = middlewares;
}
MessageBus.prototype[Symbol.toStringTag] = "MessageBus";
function messageBus(middlewares) {
  return new MessageBus(middlewares || []);
}

function conj(self, middleware) {
  self.middlewares = _.conj(self.middlewares, middleware);
}

function handle$5(self, message, next) {
  const f = _.reduce(function (memo, middleware) {
    var _middleware, _memo, _p$handle, _p;

    return _p = p, _p$handle = _p.handle, _middleware = middleware, _memo = memo, function handle(_argPlaceholder) {
      return _p$handle.call(_p, _middleware, _argPlaceholder, _memo);
    };
  }, next || _.noop, _.reverse(self.middlewares));

  f(message);
}

function dispatch(self, message) {
  handle$5(self, message);
}

var behave$7 = _.does(_.keying("MessageBus"), _.implement(mut.ITransientCollection, {
  conj
}), _.implement(IDispatch, {
  dispatch
}), _.implement(IMiddleware, {
  handle: handle$5
}));

behave$7(MessageBus);

function Command(type, attrs) {
  this.type = type;
  this.attrs = attrs;
}
Command.prototype[Symbol.toStringTag] = "Command";
function constructs(Type) {
  return function message(type) {
    return function (args, options) {
      return new Type(type, Object.assign({
        args: args || []
      }, options));
    };
  };
}
const command = constructs(Command);

function hash(self) {
  return _.hash({
    type: self.type,
    attrs: self.attrs
  });
}

function identifier(self) {
  return self.type;
}

var behave$6 = _.does(_.record, _.keying("Command"), _.implement(_.IHashable, {
  hash
}), _.implement(_.IIdentifiable, {
  identifier
}));

behave$6(Command);

function Event(type, attrs) {
  this.type = type;
  this.attrs = attrs;
}
Event.prototype[Symbol.toStringTag] = "Event";
const event = constructs(Event);
function effect(message, type) {
  const e = new Event();
  return Object.assign(e, message, {
    type: type
  });
}
function alter(message, type) {
  return Object.assign(_.clone(message), {
    type: type
  });
}

var behave$5 = _.does(behave$6, _.keying("Event"));

behave$5(Event);

function EventMiddleware(emitter) {
  this.emitter = emitter;
}
EventMiddleware.prototype[Symbol.toStringTag] = "EventMiddleware";
const eventMiddleware = _.constructs(EventMiddleware);

function handle$4(self, event, next) {
  $.pub(self.emitter, event);
  next(event);
}

var behave$4 = _.does(_.keying("EventMiddleware"), _.implement(IMiddleware, {
  handle: handle$4
}));

behave$4(EventMiddleware);

function DrainEventsMiddleware(provider, eventBus) {
  this.provider = provider;
  this.eventBus = eventBus;
}
DrainEventsMiddleware.prototype[Symbol.toStringTag] = "DrainEventsMiddleware";
const drainEventsMiddleware = _.constructs(DrainEventsMiddleware);

function handle$3(self, command, next) {
  next(command);

  _.each(function (message) {
    handle$a(self.eventBus, message, next);
  }, release$1(self.provider));
}

var behave$3 = _.does(_.keying("DrainEventsMiddleware"), _.implement(IMiddleware, {
  handle: handle$3
}));

behave$3(DrainEventsMiddleware);

function HandlerMiddleware(handlers, identify, fallback) {
  this.handlers = handlers;
  this.identify = identify;
  this.fallback = fallback;
}
HandlerMiddleware.prototype[Symbol.toStringTag] = "HandlerMiddleware";

const handlerMiddleware3 = _.constructs(HandlerMiddleware);

function handlerMiddleware2(handlers, identify) {
  return handlerMiddleware3(handlers, identify);
}

function handlerMiddleware1(handlers) {
  return handlerMiddleware2(handlers, _.identifier);
}

function handlerMiddleware0() {
  return handlerMiddleware1({});
}

const handlerMiddleware = _.overload(handlerMiddleware0, handlerMiddleware1, handlerMiddleware2, handlerMiddleware3);

function assoc(self, key, handler) {
  self.handlers = _.assoc(self.handlers, key, handler);
}

function handle$2(self, message, next) {
  const handler = _.get(self.handlers, self.identify(message), self.fallback);

  if (handler) {
    handle$a(handler, message, next);
  } else {
    next(message);
  }
}

var behave$2 = _.does(_.keying("HandlerMiddleware"), _.implement(mut.ITransientAssociative, {
  assoc
}), _.implement(IMiddleware, {
  handle: handle$2
}));

behave$2(HandlerMiddleware);

function LockingMiddleware(bus, queued, handling) {
  this.bus = bus;
  this.queued = queued;
  this.handling = handling;
}
LockingMiddleware.prototype[Symbol.toStringTag] = "LockingMiddleware";
function lockingMiddleware(bus) {
  return new LockingMiddleware(bus, [], false);
}

function handle$1(self, message, next) {
  if (self.handling) {
    self.queued.push(message);
  } else {
    self.handling = true;
    next(message);
    self.handling = false;

    if (self.queued.length) {
      var _self$bus, _p$dispatch, _p;

      const queued = self.queued;
      self.queued = [];

      _.log("draining queued", queued);

      _.each((_p = p, _p$dispatch = _p.dispatch, _self$bus = self.bus, function dispatch(_argPlaceholder) {
        return _p$dispatch.call(_p, _self$bus, _argPlaceholder);
      }), queued);
    }
  }
}

var behave$1 = _.does(_.keying("LockingMiddleware"), _.implement(IMiddleware, {
  handle: handle$1
}));

behave$1(LockingMiddleware);

function TeeMiddleware(effect) {
  this.effect = effect;
}
TeeMiddleware.prototype[Symbol.toStringTag] = "TeeMiddleware";
const teeMiddleware = _.constructs(TeeMiddleware);

function handle(self, message, next) {
  self.effect(message);
  next(message);
}

var behave = _.does(_.keying("TeeMiddleware"), _.implement(IMiddleware, {
  handle
}));

behave(TeeMiddleware);

function defs(construct, keys) {
  return _.reduce(function (memo, key) {
    return _.assoc(memo, key, construct(key));
  }, {}, keys);
}
function dispatchable(Cursor) {
  //from `atomic/reactives`
  function dispatch(self, command) {
    dispatch$2(self.source, _.update(command, "path", function (path) {
      return _.apply(_.conj, self.path, path || []);
    }));
  }

  _.doto(Cursor, _.implement(IDispatch, {
    dispatch
  }));
}

(function () {
  function dispatch(self, args) {
    return self.f(...args);
  }

  _.doto(_.Router, _.implement(IDispatch, {
    dispatch
  }));
})();

(function () {
  function dispatch(self, args) {
    return _.apply(self, args);
  }

  _.doto(Function, _.implement(IDispatch, {
    dispatch
  }));
})();

export { Bus, Command, DrainEventsMiddleware, Event, EventDispatcher, EventMiddleware, Events, HandlerMiddleware, IDispatch, IEventProvider, IMiddleware, LockingMiddleware, MessageBus, MessageHandler, MessageProcessor, Middleware, TeeMiddleware, affects, alter, bus, command, component, constructs, defs, dispatch$2 as dispatch, dispatchable, drainEventsMiddleware, effect, event, eventDispatcher, eventMiddleware, events, handle$a as handle, handlerMiddleware, lockingMiddleware, messageBus, messageHandler, messageProcessor, middleware, raise$1 as raise, release$1 as release, teeMiddleware };
