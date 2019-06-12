import {does, implement} from 'atomic/core';
import {IEventProvider} from "../../protocols/ieventprovider/instance"

function raise(self, event){
  self.queued.push(event);
}

function release(self){
  const released = self.queued;
  self.queued = [];
  return released;
}

export default does(
  implement(IEventProvider, {raise, release}));