import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {IMiddleware} from "../../protocols/imiddleware/instance.js"

function conj(self, handler){
  self.handlers = _.conj(self.handlers, handler);
  self.handler = combine(self.handlers);
}

function combine(handlers){
  const f = _.reduce(function(memo, handler){
    return function(command){
      return p.handle(handler, command, memo);
    }
  }, _.noop, _.reverse(handlers));
  function handle(x, command){
    return f(command);
  }
  return _.doto({},
    _.specify(IMiddleware, {handle}));
}

function handle(self, command, next){
  p.handle(self.handler, command, next);
}

export default _.does(
  _.implement(mut.ITransientCollection, {conj}),
  _.implement(IMiddleware, {handle}));
