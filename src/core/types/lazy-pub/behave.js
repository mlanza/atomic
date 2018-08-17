import {implement} from '../protocol';
import {effect, noop} from '../../core';
import {IStateMachine, ISubscribe, IDisposable, ICounted, IDeref} from '../../protocols';
import {transition} from "../../protocols/istatemachine/concrete";
import {swap} from "../../protocols/iswap/concrete";
import {_ as v} from "param.macro";

function sub(self, callback){
  subscribed(self) === 0 && swap(self.toggle, transition(v, "active"));
  ISubscribe.sub(self.sink, callback);
}

function unsub(self, callback){
  ISubscribe.unsub(self.sink, callback);
  subscribed(self) === 0 && swap(self.toggle, transition(v, "idle"));
}

function subscribed(self){
  return ISubscribe.subscribed(self.sink);
}

function dispose(self){
  swap(self.toggle, transition(v, "idle"));
}

function deref(self){
  subscribed(self) === 0 && sub(self, noop) && unsub(self, noop); //force refresh of observable state
  return IDeref.deref(self.sink);
}

function state(self){
  return IStateMachine.state(IDeref.deref(self.toggle));
}

export default effect(
  implement(IDeref, {deref}),
  implement(IDisposable, {dispose}),
  implement(IStateMachine, {state}),
  implement(ISubscribe, {sub, unsub, subscribed}));