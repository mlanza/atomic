import {implement, does, noop, transition, satisfies, swap, IStateMachine, IDisposable} from 'cloe/core';
import {ISubscribe} from "../../protocols/isubscribe/instance";
import {_ as v} from "param.macro";

function sub(self, callback){
  if (subscribed(self) === 0) {
    swap(self.state, transition(v, "activate"));
  }
  ISubscribe.sub(self.sink, callback);
}

function unsub(self, callback){
  ISubscribe.unsub(self.sink, callback);
  if (subscribed(self) === 0) {
    swap(self.state, transition(v, "deactivate"));
  }
}

function subscribed(self){
  return ISubscribe.subscribed(self.sink);
}

function dispose(self){
  swap(self.state, transition(v, "deactivate"));
}

function state(self){
  return IStateMachine.state(IDeref.deref(self.state));
}

export default does(
  implement(IDisposable, {dispose}),
  implement(IStateMachine, {state}),
  implement(ISubscribe, {sub, unsub, subscribed}));