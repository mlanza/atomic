import {implement, does, noop, IStateMachine, ISubscribe, IDisposable, ICounted, IDeref, transition, swap} from 'cloe/core';
import {_ as v} from "param.macro";

function sub(self, callback){
  if (subscribed(self) === 0) {
    swap(self.toggle, transition(v, "active"));
  }
  ISubscribe.sub(self.sink, callback);
}

function unsub(self, callback){
  ISubscribe.unsub(self.sink, callback);
  if (subscribed(self) === 0) {
    swap(self.toggle, transition(v, "idle"));
  }
}

function subscribed(self){
  return ISubscribe.subscribed(self.sink);
}

function dispose(self){
  swap(self.toggle, transition(v, "idle"));
}

function deref(self){
  if (subscribed(self) === 0) { //force refresh of sink state
    sub(self, noop);
    unsub(self, noop);
  }
  return IDeref.deref(self.sink);
}

function state(self){
  return IStateMachine.state(IDeref.deref(self.toggle));
}

export default does(
  implement(IDeref, {deref}),
  implement(IDisposable, {dispose}),
  implement(IStateMachine, {state}),
  implement(ISubscribe, {sub, unsub, subscribed}));