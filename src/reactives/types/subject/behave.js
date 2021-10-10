import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {IPublish, ISubscribe} from "../../protocols.js";
import {ireduce, imergable} from "../../shared.js";

function sub(self, observer){
  if (!self.terminated) {
    mut.conj(self.observers, observer);
    return _.once(function(){
      unsub(self, observer);
    });
  } else {
    throw new Error("Cannot subscribe to a terminated Subject.");
  }
}

function unsub(self, observer){
  mut.unconj(self.observers, observer);
}

function pub(self, message){
  if (!self.terminated){
    notify(self, p.pub(?, message));
  }
}

function err(self, error){
  if (!self.terminated){
    self.terminated = {how: "error", error};
    notify(self, p.err(?, error));
    self.observers = null; //release references
  }
}

function complete(self){
  if (!self.terminated){
    self.terminated = {how: "complete"};
    notify(self, p.complete);
    self.observers = null; //release references
  }
}

function closed(self){
  return self.terminated;
}

//copying prevents midstream changes to observers
function notify(self, f){
  _.each(f, _.clone(self.observers));
}

export default _.does(
  ireduce,
  imergable,
  _.naming("Subject"),
  _.implement(ISubscribe, {sub, unsub}),
  _.implement(IPublish, {pub, err, complete, closed}));
