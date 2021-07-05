import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ISubscribe, IRevertible} from "../../protocols.js";

function deref(self){
  return _.deref(self.cell);
}

function reset(self, state){
  const history = self.pos ? self.history.slice(self.pos) : self.history;
  history.unshift(state);
  while(_.count(history) > self.max) {
    history.pop();
  }
  self.history = history;
  self.pos = 0;
  _.reset(self.cell, state);
}

function swap(self, f){
  reset(self, f(IDeref.deref(self.cell)));
}

function sub(self, observer){
  p.sub(self.cell, observer);
}

function unsub(self, observer){
  p.unsub(self.cell, observer);
}

function subscribed(self){
  return p.subscribed(self.cell);
}

function undo(self){
  if (undoable(self)) {
    self.pos += 1;
    _.reset(self.cell, self.history[self.pos]);
  }
}

function redo(self){
  if (redoable(self)) {
    self.pos -= 1;
    _.reset(self.cell, self.history[self.pos]);
  }
}

function flush(self){
  self.history = [self.history[self.pos]];
  self.pos = 0;
}

function undoable(self){
  return self.pos < _.count(self.history);
}

function redoable(self){
  return self.pos > 0;
}

export default _.does(
  _.implement(_.IDeref, {deref}),
  _.implement(_.IReset, {reset}),
  _.implement(_.ISwap, {swap}),
  _.implement(IRevertible, {undo, redo, flush, undoable, redoable}),
  _.implement(ISubscribe, {sub, unsub, subscribed}));
