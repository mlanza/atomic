import {implement, does, each, once, ISwap, IReset, IDeref} from "atomic/core";
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
    //copying prevents midstream changes to observers
    each(IPublish.pub(?, message), self.observers.slice());
  }
}

function err(self, error){
  if (!self.terminated){
    self.terminated = {how: "error", error};
    //copying prevents midstream changes to observers
    each(IPublish.err(?, error), self.observers.slice());
    self.observers = null; //release references
  }
}

function complete(self){
  if (!self.terminated){
    self.terminated = {how: "complete"};
    //copying prevents midstream changes to observers
    each(IPublish.complete, self.observers.slice());
    self.observers = null; //release references
  }
}

export const behaveAsSubject = does(
  implement(ISubscribe, {sub}),
  implement(IPublish, {pub, err, complete}));