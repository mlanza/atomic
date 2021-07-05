import * as _ from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {closed} from "../../protocols/ipublish.js";
import {imergable, ireduce} from "../../shared.js";

function sub(self, observer){
  const unsub = self.subscribe(observer) || _.noop;
  return closed(observer) ? (unsub(), _.noop) : unsub;
}

export default _.does(
  ireduce,
  imergable,
  _.implement(ISubscribe, {sub, unsub: _.noop, subscribed: _.constantly(1)})); //TODO  `unsub` and `subscribed` mock implementations are for cross compatibility and may be removed post migration
