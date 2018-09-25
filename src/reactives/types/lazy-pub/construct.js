import {fsm, state, comp} from "cloe/core";
import {sub} from "../../protocols/isubscribe/concrete";
import {observable, unprimed} from "../observable";

export default function LazyPub(sink, toggle){
  this.sink = sink;
  this.toggle = toggle;
}

export function lazyPub(sink, toggled){
  const toggle = unprimed(observable(fsm("idle", {idle: ["active"], active: ["idle"]})));
  sub(toggle, comp(toggled, state));
  return new LazyPub(sink, toggle);
}