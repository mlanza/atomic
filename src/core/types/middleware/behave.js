import {effect, overload, constantly, identity, doto, noop} from '../../core';
import {reverse} from "../../protocols/ireversible/concrete";
import {reduce} from "../../protocols/ireduce/concrete";
import {IMiddleware, IPush, ICollection} from '../../protocols';
import {reifiable, implement} from '../../types/protocol';

function push(self, handler){
  self.handlers = ICollection.conj(self.handlers, handler);
  self.handler = combine(self.handlers);
}

function combine(handlers){
  const f = reduce(function(memo, handler){
    return function(command){
      return IMiddleware.handle(handler, command, memo);
    }
  }, noop, reverse(handlers));
  function handle(_, command){
    return f(command);
  }
  const compound = reifiable();
  doto(compound.constructor,
    implement(IMiddleware, {handle}));
  return compound;
}

function handle(self, command, next){
  IMiddleware.handle(self.handler, command, next);
}

export default effect(
  implement(IPush, {push}),
  implement(IMiddleware, {handle}));