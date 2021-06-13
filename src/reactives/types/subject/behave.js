import {implement, does, each, once, clone, ISwap, IReset, IDeref} from "atomic/core";
import {IPublish, ISubscribe} from "../../protocols.js";

function sub(self, observer){
  if (!self.terminated) {
    self.observers.push(observer);
    return once(function(){
      const pos = self.observers.lastIndexOf(observer);
      if (pos > -1) {
        self.observers.splice(pos, 1);
      }
    });
  } else {
    throw new Error("Cannot subscribe to a terminated Subject.");
  }
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
  implement(ISubscribe, {sub}),
  implement(IPublish, {pub, err, complete}));