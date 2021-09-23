import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
import * as t from "atomic/transducers";
import Symbol from "symbol";
import Promise from "promise";
import {IPublish, ISubscribe} from "./protocols.js";
import {ireduce} from "./shared.js";
import {Cell, cell} from "./types/cell/construct.js";
import {Subject, subject} from "./types/subject/construct.js";
import {Observable, sharing, share, pipe} from "./types/observable.js";
import {Observer} from "./types/observer/construct.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";

const c = sharing(?, cell),
      s = sharing(?, subject);

export function collect(cell){
  return function(value){ //return observer
    _.swap(cell, _.conj(?, value));
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

export const map = _.comp(c, Observable.map);
export const then = _.comp(c, Observable.resolve, Observable.map);
export const fromElement = _.comp(c, Observable.fromElement);
export const fromEvent = _.comp(s, Observable.fromEvent);
export const event = _.called(fromEvent, "`event` is deprecated — use `fromEvent` instead.");
export const interact = _.called(fromElement, "`interact` is deprecated — use `fromElement` instead.");
export const computed = _.comp(c, Observable.computed);
export const fixed = _.comp(c, Observable.fixed);
export const latest = _.comp(c, Observable.latest);
export const splay = _.comp(c, Observable.splay);
export const tick = _.comp(s, Observable.tick);
export const when = _.comp(c, Observable.when);
export const depressed = _.comp(c, Observable.depressed);
export const toggles = _.comp(c, Observable.toggles);
export const focus = _.comp(c, Observable.focus);
export const click = _.comp(s, Observable.click);
export const hover = _.comp(c, Observable.hover);
export const hist = _.comp(c, Observable.hist);
export const hash = _.comp(c, Observable.hash);
export const hashchange = _.called(hash, "`hashchange` is deprecated — use `hash` instead.");
export const readonly = _.called(_.identity, "`readonly` is deprecated.");

function fmap(source, f){
  return map(f, source);
}

_.each(_.implement(_.IFunctor, {fmap}), [Cell, Subject, Observable]);

function fromPromise2(promise, init){
  return share(Observable.fromPromise(promise), cell(init));
}

export const fromPromise = _.overload(null, fromPromise2(?, null), fromPromise2);

export const join = _.called(function join(sink, ...sources){
  return share(_.merge(...sources), sink);
}, "`join` is deprecated — use `merge` instead.");

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
          p.trigger(args[0], "mutate", {bubbles: true});
        } finally {
          queue.shift();
        }
      }
    }
  }
}

function mutate3(self, state, f){
  p.sub(state, _.partial(isolate(f), self));
  return self;
}

function mutate2(state, f){
  return mutate3(?, state, f);
}

export const mutate = _.called(_.overload(null, null, mutate2, mutate3), "`mutate` is deprecated — use `render` instead.");

function render3(el, obs, f){
  return p.sub(obs, t.isolate(), function(state){
    f(el, state);
    p.trigger(el, "mutate", {bubbles: true}); //TODO rename
  });
}

function render2(state, f){
  return render3(?, state, f);
}

export const render = _.overload(null, null, render2, render3);

function renderDiff3(el, obs, f){
  return p.sub(obs, t.isolate(), t.hist(2), function(history){
    const args = [el].concat(history);
    f.apply(this, args); //overload arity 2 & 3 for initial and diff rendering
    p.trigger(el, "mutate", {bubbles: true}); //TODO rename
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
    _.implement(IPublish, {pub, err: _.noop, complete: _.noop, closed: _.noop}));

})();
