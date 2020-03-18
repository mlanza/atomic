import {protocol} from "../../types/protocol";

function clone(self){
  return Object.assign(Object.create(self.constructor.prototype), self);
}

export const ICloneable = protocol({clone});