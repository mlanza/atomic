import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
import * as t from "./transducers.js";
import {IPublish, ISubscribe} from "./protocols.js";
import {reducible} from "./shared.js";
import {Cell, cell} from "./types/cell/construct.js";
import {Subject, subject} from "./types/subject/construct.js";
import {Observable, shared, share, pipe} from "./types/observable.js";
import {Observer} from "./types/observer/construct.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";

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
export const map = shared(cell, Observable.map);
export const then = shared(cell, Observable.resolve, Observable.map);
export const interact = shared(cell, Observable.interact);
export const fromEvent = shared(subject, Observable.fromEvent);
export const computed = shared(cell, Observable.computed);
export const fixed = shared(cell, Observable.fixed);
export const latest = shared(cell, Observable.latest);
export const splay = shared(cell, Observable.splay);
export const tick = shared(subject, Observable.tick);
export const when = shared(cell, Observable.when);
export const toggles = shared(cell, Observable.toggles);
export const hist = shared(cell, Observable.hist);

function fmap(source, f){
  return map(f, source);
}

_.each(_.implement(_.IFunctor, {fmap}), [Cell, Subject, Observable]);

function fromPromise2(promise, init){
  return share(Observable.fromPromise(promise), cell(init));
}

export const fromPromise = _.overload(null, fromPromise2(?, null), fromPromise2);

//enforce sequential nature of operations
function isolate1(f){ //TODO treat operations as promises
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

export const isolate = _.overload(t.isolate, isolate1);

function render3(el, obs, f){
  return p.sub(obs, isolate0(), function(state){
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
    reducible, //makes fns work as observers like `cell`, e.g. `$.connect($.tick(3000), _.see("foo"))`
    _.implement(IPublish, {pub, err: _.noop, complete: _.noop, closed: _.noop}));

})();
