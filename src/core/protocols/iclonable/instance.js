import {protocol} from "../../types/protocol.js";

//a persistent returns its identity, a faux persistent (e.g. an object, an array) returns a copy assuming a mutation is at hand.

function clone(self){
  return Object.assign(Object.create(self.constructor.prototype), self);
}

export const IClonable = protocol({clone});