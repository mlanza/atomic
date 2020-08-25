import {kin} from "../../core";
import {IEquiv} from "./instance";
export function equiv(self, other){
  return self === other || IEquiv.equiv(self, other);
}

export function alike(self, other) { //same parts? structural equality?
  if (kin(self, other)) {
    for(let prop of self.getOwnPropertyNames()) {
      if (!equiv(self[prop], other[prop])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}