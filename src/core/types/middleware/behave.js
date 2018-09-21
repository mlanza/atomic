import {does, doto, noop} from '../../core';
import {reverse} from "../../protocols/ireversible/concrete";
import {reduce} from "../../protocols/ireduce/concrete";
import {IMiddleware, ICollection} from '../../protocols';
import {specify, implement} from '../../types/protocol';

function conj(self, handler){
  self.handlers = ICollection.conj(self.handlers, handler);
  self.handler = combine(self.handlers);
  return self;
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
  return doto({},
    specify(IMiddleware, {handle}));
}

function handle(self, command, next){
  IMiddleware.handle(self.handler, command, next);
}

export default does(
  implement(ICollection, {conj}),
  implement(IMiddleware, {handle}));