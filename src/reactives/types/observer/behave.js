import * as _ from "atomic/core";
import {IPublish} from "../../protocols.js";
import Symbol from "symbol";

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

function closed(self){
  return self.terminated;
}

export default _.does(
  _.naming(?, Symbol("Observer")),
  _.implement(IPublish, {pub, err, complete, closed}));
