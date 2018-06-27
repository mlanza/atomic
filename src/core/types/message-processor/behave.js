import {effect} from '../../core';
import {implement} from '../protocol';
import {IMiddleware} from '../../protocols';

function handle(self, message, next){
  self.action(message);
  next(message);
}

export default effect(
  implement(IMiddleware, {handle}));