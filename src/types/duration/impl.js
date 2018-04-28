import {implement} from '../../protocol';
import {doto} from '../../core';
import Duration from '../../types/duration/construct';
import IOffset from '../../protocols/ioffset';

function increment(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

function decrement(self, dt){
  return new Date(dt.valueOf() - self.milliseconds);
}

doto(Duration,
  implement(IOffset, {increment: increment, decrement: decrement}));