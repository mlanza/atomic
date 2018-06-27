import {reifiable, implement} from '../../types/protocol';
import {IReduce, IReversible, IMiddleware} from '../../protocols';
import {doto, noop} from '../../core';

export default function CommandBus(handler){
  this.handler = handler;
}

export function commandBus(middlewares){
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
  return new CommandBus(middleware);
}