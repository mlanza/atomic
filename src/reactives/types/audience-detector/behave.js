import * as _ from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe/instance.js";
import {ireduce, imergable} from "../../shared.js";

function sub(self, observer){
  if (subscribed(self) === 0) {
    _.swap(self.state, _.transition(?, "activate"));
  }
  ISubscribe.sub(self.sink, observer);
  return _.once(function(){
    return unsub(self, observer);
  });
}

function unsub(self, observer){
  ISubscribe.unsub(self.sink, observer);
  if (subscribed(self) === 0) {
    _.swap(self.state, _.transition(?, "deactivate"));
  }
}

function subscribed(self){
  return ISubscribe.subscribed(self.sink);
}

function dispose(self){
  _.swap(self.state, _.transition(?, "deactivate"));
}

function state(self){
  return _.state(_.deref(self.state));
}

export default _.does(
  ireduce,
  imergable,
  _.implement(_.IDisposable, {dispose}),
  _.implement(_.IStateMachine, {state}),
  _.implement(ISubscribe, {sub, unsub, subscribed}));
