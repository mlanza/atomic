import {does, implement, each, once, clone, ICounted} from "atomic/core";
import * as mut from "atomic/transients";
import {IPublish, ISubscribe} from "../../protocols.js";
import {ireduce, imergeable} from "../../shared.js";

function sub(self, observer){
  if (!self.terminated) {
    mut.conj(self.observers, observer);
    return once(function(){
      unsub(self, observer);
    });
  } else {
    throw new Error("Cannot subscribe to a terminated Subject.");
  }
}

function unsub(self, observer){
  mut.unconj(self.observers, observer);
}

function subscribed(self){
  return ICounted.count(self.observers);
}

function pub(self, message){
  if (!self.terminated){
    notify(self, IPublish.pub(?, message));
  }
}

function err(self, error){
  if (!self.terminated){
    self.terminated = {how: "error", error};
    notify(self, IPublish.err(?, error));
    self.observers = null; //release references
  }
}

function complete(self){
  if (!self.terminated){
    self.terminated = {how: "complete"};
    notify(self, IPublish.complete);
    self.observers = null; //release references
  }
}

//copying prevents midstream changes to observers
function notify(self, f){
  each(f, clone(self.observers));
}

export const behaveAsSubject = does(
  ireduce,
  imergeable,
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IPublish, {pub, err, complete}));