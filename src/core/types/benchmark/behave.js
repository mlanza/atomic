import {implement} from '../protocol';
import {does} from '../../core';
import {IBounds} from '../../protocols';

function start(self){
  return IBounds.start(self.period);
}

function end(self){
  return IBounds.start(self.period);
}

export const behaveAsBenchmark = does(
  implement(IBounds, {start, end}));