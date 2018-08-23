import {IEventProvider} from '../../protocols';
import {does} from '../../core';
import {implement} from '../protocol';

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