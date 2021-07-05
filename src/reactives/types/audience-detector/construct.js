import * as _ from "atomic/core";
import {sub, unsub, subscribed} from "../../protocols/isubscribe/concrete.js";
import {pub} from "../../protocols/ipublish/concrete.js";
import {cell} from "../cell.js";

function deref(self){
  if (subscribed(self) === 0) { //force refresh of sink state
    sub(self, _.noop);
    unsub(self, _.noop);
  }
  return _.deref(self.sink);
}

export function AudienceDetector(sink, state){
  this.sink = sink;
  this.state = state;
}

function audienceDetector2(sink, detected){
  const init = subscribed(sink) === 0 ? "idle" : "active";
  const $state = cell(_.fsm(init, {idle: {activate: "active"}, active: {deactivate: "idle"}}));
  sub($state, _.comp(detected, _.state));
  const result = new AudienceDetector(sink, $state);
  if (_.satisfies(_.IDeref, sink)) {
    _.specify(_.IDeref, {deref}, result);
  }
  return result;
}

function audienceDetector3(sink, xf, source){
  const observer = _.partial(xf(pub), sink);
  return audienceDetector2(sink, function(state) {
    const f = state === "active" ? sub : unsub;
    f(source, observer);
  });
}

export const audienceDetector = _.overload(null, null, audienceDetector2, audienceDetector3);
