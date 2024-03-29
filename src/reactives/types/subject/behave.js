import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IPublish, ISubscribe} from "../../protocols.js";
import {reducible, mergable} from "../../shared.js";

function sub(self, observer){
  if (!self.terminated) {
    _.vswap(self.observers, _.conj(?, observer));
    return _.once(function(){
      _.vswap(self.observers, _.unconj(?, observer));
    });
  } else {
    throw new Error("Cannot subscribe to a terminated Subject.");
  }
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
    _.vswap(self.observers, _.empty); //release references
  }
}

function complete(self){
  if (!self.terminated){
    self.terminated = {how: "complete"};
    notify(self, p.complete);
    _.vswap(self.observers, _.empty); //release references
  }
}

function closed(self){
  return self.terminated;
}

function notify(self, f){
  _.each(f, _.deref(self.observers));
}

export default _.does(
  reducible,
  mergable,
  _.keying("Subject"),
  _.implement(ISubscribe, {sub}),
  _.implement(IPublish, {pub, err, complete, closed}));
