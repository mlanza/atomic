import {implement, does, noop, transition, satisfies, swap, IStateMachine, IDisposable} from 'atomic/core';
import {ISubscribe} from "../../protocols/isubscribe/instance";

function sub(self, observer){
  if (subscribed(self) === 0) {
    swap(self.state, transition(?, "activate"));
  }
  ISubscribe.sub(self.sink, observer);
}

function unsub(self, observer){
  ISubscribe.unsub(self.sink, observer);
  if (subscribed(self) === 0) {
    swap(self.state, transition(?, "deactivate"));
  }
}

function subscribed(self){
  return ISubscribe.subscribed(self.sink);
}

function dispose(self){
  swap(self.state, transition(?, "deactivate"));
}

function state(self){
  return IStateMachine.state(IDeref.deref(self.state));
}

export const behaveAsAudienceDetector = does(
  implement(IDisposable, {dispose}),
  implement(IStateMachine, {state}),
  implement(ISubscribe, {sub, unsub, subscribed}));