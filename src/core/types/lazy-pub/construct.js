import {fsm} from "../fsm/construct";
import {observable, unprimed} from "../observable";
import {sub} from "../../protocols/isubscribe/concrete";
import {state} from "../../protocols/istatemachine/concrete";

export default function LazyPub(sink, toggle){
  this.sink = sink;
  this.toggle = toggle;
}

export function lazyPub(sink, activate, deactivate){
  const toggle = unprimed(observable(fsm("idle", {idle: ["active"], active: ["idle"]})));
  sub(toggle, function(obj){
    state(obj) === "active" ? activate() : deactivate();
  });
  return new LazyPub(sink, toggle);
}