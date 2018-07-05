import {reifiable, implement} from '../../types/protocol';
import {IReduce, IPublish, IReversible, IMiddleware} from '../../protocols';
import {doto, noop, overload} from '../../core';
import {publisher} from '../publisher';
import {messageHandler} from '../message-handler';
import {messageProcessor} from '../message-processor';
import {observable} from '../observable';
import {_ as v} from "param.macro";

export default function CommandBus(handler, publ){
  this.handler = handler;
  this.publ = publ;
}

function commandBus1(handler){
  return commandBus2(handler, publisher());
}

function commandBus2(handler, publ){
  return new CommandBus(handler, publ);
}

function commandBus3(state, commands, events){
  return commandBus4(state, commands, events, publisher());
}

function commandBus4(state, commands, events, publ){
  return commandBus2(middleware4(state, commands, events, publ), publ);
}

export const commandBus = overload(null, commandBus1, commandBus2, commandBus3, commandBus4);

function middleware1(handlers){
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

function middleware4(state, commands, events, publ){
  return middleware([
    messageHandler(commands(state)),
    messageHandler(events(state)),
    messageProcessor(IPublish.pub(publ, v))
  ]);
}

export const middleware = overload(null, middleware1, null, null, middleware4);