import * as _ from "atomic/core";
import * as $ from "./effects.js";
import * as p from "./protocols/concrete.js";
import * as t from "./transducers.js";
import {ILogger, IPublish, ISubscribe} from "./protocols.js";
import {reducible} from "./shared.js";
import {Atom, atom} from "./types/atom/construct.js";
export {atom as cell} from "./types/atom/construct.js"; //preserve legacy name
import {Subject, subject} from "./types/subject/construct.js";
import {Observable, shared, share, pipe} from "./types/observable.js";
import {Observer} from "./types/observer/construct.js";
import {IDispatch} from "./protocols/idispatch/instance.js";
import config from "./config.js";
export {default as config} from "./config.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./effects.js";
export {doto, fork, rand, randNth, shuffle, specify, implement, uid, guid} from "atomic/core"; //reexport side effecting ops
import {behaviors} from "./behaviors.js";
import {nativeMap} from "./types/map.js";
export * from "./behaviors.js";
export const behave = _.behaves(behaviors, ?);

function into2(to, from){
  return _.reduce(function(memo, value){
    p.conj(memo, value);
    return memo;
  }, to, from);
}
function into3(to, xform, from){
  return _.transduce(xform, function(memo, value){
    p.conj(memo, value);
    return memo;
  }, to, from);
}

export const into = _.overload(null, null, into2, into3);

export function collect(atom){
  return function(value){ //return observer
    p.swap(atom, _.conj(?, value));
  }
}

function connect2(source, sink){
  return p.sub(source, sink);
}

function connect3(source, xform, sink){
  return p.sub(pipe(source, xform), sink);
}

function connectN(source){
  const sink = arguments[arguments.length - 1],
        xforms = _.slice(arguments, 1, arguments.length - 1);
  return p.sub(pipe(source, ...xforms), sink);
}

ISubscribe.transducing = connect3;

export const connect = _.overload(null, null, connect2, connect3, connectN); //returns `unsub` fn
export const map = _.overload(nativeMap, nativeMap, shared(atom, Observable.map));
export const then = shared(atom, Observable.resolve, Observable.map);
export const interact = shared(atom, Observable.interact);
export const fromEvent = shared(subject, Observable.fromEvent);
export const computed = shared(atom, Observable.computed);
export const fixed = shared(atom, Observable.fixed);
export const latest = shared(atom, Observable.latest);
export const splay = shared(atom, Observable.splay);
export const tick = shared(subject, Observable.tick);
export const when = shared(atom, Observable.when);
export const toggles = shared(atom, Observable.toggles);
export const hist = shared(atom, Observable.hist);

function fmap(source, f){
  return map(f, source);
}

$.each(_.implement(_.IFunctor, {fmap}), [Atom, Subject, Observable]);

function fromPromise2(promise, init){
  return share(Observable.fromPromise(promise), atom(init));
}

export const fromPromise = _.overload(null, fromPromise2(?, null), fromPromise2);

(function(){

  function dispatch(self, args){
    return _.apply(self, args);
  }

  function pub(self, msg){
    self(msg);
  }

  _.doto(Function,
    reducible, //makes fns work as observers like `atom`, e.g. `$.connect($.tick(3000), $.see("foo"))`
    _.implement(IPublish, {pub, err: _.noop, complete: _.noop, closed: _.noop}));

})();

export function defs(construct, keys){
  return _.reduce(function(memo, key){
    return _.assoc(memo, key, construct(key));
  }, {}, keys);
}

export function dispatchable(Cursor){

  function dispatch(self, command){
    p.dispatch(self.source, _.update(command, "path", function(path){
      return _.apply(_.conj, self.path, path || []);
    }));
  }

  _.doto(Cursor,
     _.implement(IDispatch, {dispatch}));

}

(function(){

  function dispatch(self, args){
    return _.apply(self, args);
  }

  _.doto(Function,
    _.implement(IDispatch, {dispatch}));

})();

_.addMethod(_.coerce, [Set, Array], Array.from);

(function(){
  function log(self, ...args){
    self.log(...args);
  }

  _.doto(console,
    _.specify(ILogger, {log}));
})();

(function(){
  function log(self, ...args){
    self(...args);
  }

  _.doto(Function,
    _.implement(ILogger, {log}));
})();

_.doto(_.Nil,
  _.implement(ILogger, {log: _.noop}));

function severity2(logger, severity){
  const f = _.get(logger, severity, _.noop);
  function log(self, ...args){
    f(...args);
  }
  return _.doto({logger, severity},
    _.specify(ILogger, {log}));
}

function severity1(severity){
  return severity2(config.logger, severity);
}

const severity = _.overload(null, severity1, severity2);

function inspect(logger, ...effects){
  function log(self, ...args){
    p.log(logger, ...[..._.mapa(_.execute, effects), ...args]);
  }
  return _.doto({logger, effects},
    _.specify(ILogger, {log}));
}

function label(logger, ...labels){
  function log(self, ...args){
    p.log(logger, ...[...labels, ...args]);
  }
  return _.doto({logger, labels},
    _.specify(ILogger, {log}));
}

//composable logging
export const logging = {
  severity, inspect, label
}

/*
const {severity, inspect, label} = $.logging;
const warn = severity(console, "warn");
const when = inspect(warn, _.date); //can interrogate current value of state container
const b = label(when, "basement");
const br = label(b, "boiler room"); //a nested part of program
$.log(br, "pressure high!");

*/

export function tee(f){
  return function(value){
    f(value);
    return value;
  }
}

export function peek(logger){
  return tee(p.log(logger, ?));
}

export function see(...labels){
  return tee(_.partial(p.log, ...labels));
}

function called4(fn, message, context, logger){
  return function(){
    const meta = Object.assign({}, context, {fn, arguments});
    p.log(logger, message, meta);
    return meta.results = fn.apply(this, arguments);
  }
}

function called3(fn, message, context){
  return called4(fn, message, context, config.logger);
}

function called2(fn, message){
  return called3(fn, message, {});
}

export const called = _.overload(null, null, called2, called3, called4);

//optimizated for large sequences
_.addMethod(_.coerce, [Array, Object], arr => into({}, arr));
_.addMethod(_.coerce, [Object, Array], obj => into([], obj));
_.addMethod(_.coerce, [_.HashSet, Array], set => into([], set));
_.addMethod(_.coerce, [Array, _.HashSet], arr => into(_.set([]), arr));
