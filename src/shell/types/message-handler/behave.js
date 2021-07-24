import * as _ from "atomic/core";
import * as p from "../../protocols/concrete";
import {IMiddleware} from "../../../shell/protocols/imiddleware/instance.js"

function handle(self, command, next){
  const type = _.get(command, "type");
  const handler = _.get(self.handlers, type, self.fallback);
  p.handle(handler, command, next);
}

export default _.does(
  _.implement(IMiddleware, {handle}));
