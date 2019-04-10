import {satisfies, fsm, state, comp, partial, overload, specify, identity, IDeref} from "cloe/core";
import {sub, unsub, subscribed} from "../../protocols/isubscribe/concrete";
import {pub} from "../../protocols/ipublish/concrete";
import {cell} from "../cell";

function deref(self){
  if (subscribed(self) === 0) { //force refresh of sink state
    sub(self, noop);
    unsub(self, noop);
  }
  return IDeref.deref(self.sink);
}

export default function AudienceDetector(sink, state){
  this.sink = sink;
  this.state = state;
}

function audienceDetector2(sink, detected){
  const init = subscribed(sink) === 0 ? "idle" : "active";
  const $state = cell(fsm(init, {idle: {activate: "active"}, active: {deactivate: "idle"}}));
  sub($state, comp(detected, state));
  const result = new AudienceDetector(sink, $state);
  if (satisfies(IDeref, sink)) {
    specify(IDeref, {deref}, result);
  }
  return result;
}

function audienceDetector3(sink, xf, source){
  const observer = partial(xf(pub), sink);
  return audienceDetector2(sink, function(state) {
    const f = state === "active" ? sub : unsub;
    f(source, observer);
  });
}

export const audienceDetector = overload(null, null, audienceDetector2, audienceDetector3);