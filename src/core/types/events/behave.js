import {IEventProvider} from '../../protocols';
import {effect} from '../../core';
import {implement} from '../protocol';

function raise(self, event){
  self.queued.push(event);
}

function release(self){
  const released = self.queued;
  self.queued = [];
  return released;
}

export default effect(
  implement(IEventProvider, {raise, release}));