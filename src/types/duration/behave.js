import {implement} from '../../protocol';
import {effect} from '../../core';
import IOffset from '../../protocols/ioffset';

function increment(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

function decrement(self, dt){
  return new Date(dt.valueOf() - self.milliseconds);
}

export default effect(
  implement(IOffset, {increment: increment, decrement: decrement}));