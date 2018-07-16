import {reifiable, implement} from '../../types/protocol';
import {IReduce, IPublish, IReversible, IMiddleware} from '../../protocols';
import {doto, noop, overload} from '../../core';
import {publisher} from '../publisher';
import {messageHandler} from '../message-handler';
import {messageProcessor} from '../message-processor';
import {observable} from '../observable';
import {_ as v} from "param.macro";

export default function CommandBus(config, handler, state){
  this.config = config;
  this.handler = handler;
  this.state = state;
}

function commandBus3(config, handler, state){
  return new CommandBus(config, handler, state);
}

function commandBus4(config, commands, events, state){
  return commandBus5(config, commands, events, publisher(), state);
}

function commandBus5(config, commands, events, publisher, state){
  var bus = new CommandBus(config, null, state);
  bus.handler = middleware([
    messageHandler(commands(bus)),
    messageHandler(events(bus)),
    messageProcessor(IPublish.pub(publisher, v))
  ]);
  return bus;
}

export const commandBus = overload(null, null, null, commandBus3, commandBus4, commandBus5);

export function middleware(handlers){
  const f = IReduce.reduce(IReversible.reverse(handlers), function(memo, handler){
    return function(command){
      return IMiddleware.handle(handler, command, memo);
    }
  }, noop);
  function handle(_, command){
    return f(command);
  }
  const compound = reifiable();
  doto(compound.constructor,
    implement(IMiddleware, {handle}));
  return compound;
}
