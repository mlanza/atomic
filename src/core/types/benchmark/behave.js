import {implement} from '../protocol';
import {effect} from '../../core';
import {IBounds} from '../../protocols';

function start(self){
  return IBounds.start(self.period);
}

function end(self){
  return IBounds.start(self.period);
}

export default effect(
  implement(IBounds, {start, end}));