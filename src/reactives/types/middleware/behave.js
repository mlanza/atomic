import {deprecated, does, doto, noop, reverse, reduce, specify, implement, ICollection} from 'atomic/core';
import {ITransientCollection} from 'atomic/transients';
import {IMiddleware} from "../../protocols/imiddleware/instance"

function _conj(self, handler){
  self.handlers = ICollection.conj(self.handlers, handler);
  self.handler = combine(self.handlers);
}

function conj(self, handler){
  deprecated(self, "ICollection.conj deprecated. Use ITransientCollection.conj.");
  _conj(self, handler);
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
  implement(ITransientCollection, {conj: _conj}),
  implement(IMiddleware, {handle}));