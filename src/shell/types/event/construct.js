import * as _ from "atomic/core";
import {constructs} from "../command/construct.js";

export function Event(type, attrs){
  this.type = type;
  this.attrs = attrs;
}

export const event = constructs(Event);

export function effect(message, type){
  const e = new Event();
  return Object.assign(e, message, {type: type});
}

export function alter(message, type){
  return Object.assign(_.clone(message), {type: type});
}
