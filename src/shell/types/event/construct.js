import * as _ from "atomic/core";
import {constructs} from "../command/construct.js";
import Symbol from "symbol";

export function Event(type, attrs){
  this.type = type;
  this.attrs = attrs;
}

Event.prototype[Symbol.toStringTag] = "Event";

export const event = constructs(Event);

export function effect(message, type){
  const e = new Event();
  return Object.assign(e, message, {type: type});
}

export function alter(message, type){
  return Object.assign(_.clone(message), {type: type});
}
