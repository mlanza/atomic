import {does, implement, each, once, clone, IReduce, ICounted} from "atomic/core";
import {ITransientCollection, ITransientYankable} from "atomic/transients";
import {IPublish, ISubscribe} from "../../protocols.js";

function sub(self, observer){
  if (!self.terminated) {
    ITransientCollection.conj(self.observers, observer);
    return once(function(){
      unsub(self, observer);
    });
  } else {
    throw new Error("Cannot subscribe to a terminated Subject.");
  }
}

function unsub(self, observer){
  ITransientCollection.unconj(self.observers, observer);
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

function reduce(self, xf, init){
  return ISubscribe.sub(init, xf(self, ?)); //TODO implement `sub` on arrays?
}

export const behaveAsSubject = does(
  implement(IReduce, {reduce}),
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IPublish, {pub, err, complete}));