import {does, constantly, noop, implement} from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {closed} from "../../protocols/ipublish.js";
import {imergable, ireduce} from "../../shared.js";

function sub(self, observer){
  const unsub = self.subscribe(observer) || noop;
  return closed(observer) ? (unsub(), noop) : unsub;
}

export default does(
  ireduce,
  imergable,
  implement(ISubscribe, {sub, unsub: noop, subscribed: constantly(1)})); //TODO  `unsub` and `subscribed` mock implementations are for cross compatibility and may be removed post migration