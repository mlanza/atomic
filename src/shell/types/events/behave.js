import * as _ from "atomic/core";
import {IEventProvider} from "../../protocols/ieventprovider/instance.js"
import Symbol from "symbol";

function raise(self, event){
  self.queued.push(event);
}

function release(self){
  const released = self.queued;
  self.queued = [];
  return released;
}

export default _.does(
  _.naming(?, Symbol("Events")),
  _.implement(IEventProvider, {raise, release}));
