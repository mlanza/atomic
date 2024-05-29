import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IMiddleware, IAssociative} from "../../protocols.js";

function assoc(self, key, handler){
  p.assoc(self.handlers, key, handler);
}

function handle(self, message, next){
  const handler = _.get(self.handlers, self.identify(message), self.fallback);
  if (handler){
    p.handle(handler, message, next);
  } else {
    next(message);
  }
}

export default _.does(
  _.keying("HandlerMiddleware"),
  _.implement(IAssociative, {assoc}),
  _.implement(IMiddleware, {handle}));
