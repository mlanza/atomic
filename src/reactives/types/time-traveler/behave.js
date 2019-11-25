import {does, implement, ICounted, IDeref, IReset, ISwap} from "atomic/core";
import {ISubscribe, ITimeTraveler} from "../../protocols";

function deref(self){
  return IDeref.deref(self.cell);
}

function reset(self, state){
  const history = self.pos ? self.history.slice(self.pos) : self.history;
  history.unshift(state);
  while(ICounted.count(history) > self.max) {
    history.pop();
  }
  self.history = history;
  self.pos = 0;
  IReset.reset(self.cell, state);
}

function swap(self, f){
  reset(self, f(IDeref.deref(self.cell)));
}

function sub(self, observer){
  ISubscribe.sub(self.cell, observer);
}

function unsub(self, observer){
  ISubscribe.unsub(self.cell, observer);
}

function subscribed(self){
  return ISubscribe.subscribed(self.cell);
}

function undo(self){
  if (undoable(self)) {
    self.pos += 1;
    IReset.reset(self.cell, self.history[self.pos]);
  }
}

function redo(self){
  if (redoable(self)) {
    self.pos -= 1;
    IReset.reset(self.cell, self.history[self.pos]);
  }
}

function flush(self){
  self.history = [self.history[self.pos]];
  self.pos = 0;
}

function undoable(self){
  return self.pos < ICounted.count(self.history);
}

function redoable(self){
  return self.pos > 0;
}

export const behaveAsTimeTraveler = does(
  implement(ITimeTraveler, {undo, redo, flush, undoable, redoable}),
  implement(IDeref, {deref}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}),
  implement(ISubscribe, {sub, unsub, subscribed}));