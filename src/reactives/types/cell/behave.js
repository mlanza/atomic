import * as _ from 'atomic/core';
import * as p from "../../protocols/concrete.js";
import {IPublish, ISubscribe} from "../../protocols.js";
import {ireduce, imergable} from "../../shared.js";

function pub(self, value){
  if (value !== self.state){
    if (!self.validate || self.validate(value)) {
      self.state = value;
      p.pub(self.observer, value);
    } else {
      throw new Error("Cell update failed - invalid value.");
    }
  }
}

function err(self, observer){
  p.err(self.observer, observer);
}

function complete(self){
  p.complete(self.observer);
}

function closed(self){
  return p.closed(self.observer);
}

function sub(self, observer){
  p.pub(observer, self.state); //to prime subscriber state
  return p.sub(self.observer, observer); //return unsubscribe fn
}

function unsub(self, observer){
  p.unsub(self.observer, observer);
}

function subscribed(self){
  return p.subscribed(self.observer);
}

function deref(self){
  return self.state;
}

function swap(self, f){
  pub(self, f(self.state));
}

function dispose(self){
  _.satisfies(_.IDisposable, self.observer) && _.dispose(self.observer);
}

export default _.does(
  ireduce,
  imergable,
  _.implement(_.IDisposable, {dispose}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IReset, {reset: pub}),
  _.implement(_.ISwap, {swap}),
  _.implement(ISubscribe, {sub, unsub, subscribed}),
  _.implement(IPublish, {pub, err, complete, closed}));
