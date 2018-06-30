import {reifiable, implement} from '../../types/protocol';
import {IReduce, IPublish, IReversible, IMiddleware} from '../../protocols';
import {doto, noop, overload} from '../../core';
import {messageHandler} from '../message-handler';
import {messageProcessor} from '../message-processor';
import {_ as v} from "param.macro";

export default function CommandBus(handler, publ){
  this.handler = handler;
  this.publ = publ;
}

function commandBus2(middlewares, publ){
  const f = IReduce.reduce(IReversible.reverse(middlewares), function(memo, middleware){
    return function(command){
      return IMiddleware.handle(middleware, command, memo);
    }
  }, noop);
  function handle(_, command){
    return f(command);
  }
  const middleware = reifiable();
  doto(middleware.constructor,
    implement(IMiddleware, {handle}));
  return new CommandBus(middleware, publ);
}

function commandBus4(state, commands, events, publ){
  return commandBus2([
    messageHandler(commands(state)),
    messageHandler(events(state)),
    messageProcessor(IPublish.pub(publ, v))
  ], publ);
}

export const commandBus = overload(null, null, commandBus2, null, commandBus4);