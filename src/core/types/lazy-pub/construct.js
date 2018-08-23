import {fsm} from "../fsm/construct";
import {observable, unprimed} from "../observable";
import {sub} from "../../protocols/isubscribe/concrete";
import {state} from "../../protocols/istatemachine/concrete";
import {comp} from "../../types/function/concrete";

export default function LazyPub(sink, toggle){
  this.sink = sink;
  this.toggle = toggle;
}

export function lazyPub(sink, toggled){
  const toggle = unprimed(observable(fsm("idle", {idle: ["active"], active: ["idle"]})));
  sub(toggle, comp(toggled, state));
  return new LazyPub(sink, toggle);
}