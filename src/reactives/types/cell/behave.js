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

const complete = _.noop; //if completed, future subscribes to get the last known value would fail.

function closed(self){
  return p.closed(self.observer);
}

function sub(self, observer){
  p.pub(observer, self.state); //to prime subscriber state
  return p.sub(self.observer, observer); //return unsubscribe fn
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
  _.keying("Cell"),
  _.implement(_.IDisposable, {dispose}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IReset, {reset: pub}),
  _.implement(_.ISwap, {swap}),
  _.implement(ISubscribe, {sub}),
  _.implement(IPublish, {pub, err, complete, closed}));
