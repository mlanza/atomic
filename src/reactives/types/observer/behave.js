import {does, implement} from "atomic/core";
import {IPublish} from "../../protocols.js";

function pub(self, message){
  if (!self.terminated) {
    return self.pub(message); //unusual for a command but required by transducers
  }
}

function err(self, error){
  if (!self.terminated) {
    self.terminated = {how: "error", error};
    self.err(error);
  }
}

function complete(self){
  if (!self.terminated){
    self.terminated = {how: "complete"};
    self.complete();
  }
}

export const behaveAsObserver = does(
  implement(IPublish, {pub, err, complete}));