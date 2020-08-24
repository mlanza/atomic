import {IEquiv} from "./instance";
export function equiv(self, other){
  return self === other || IEquiv.equiv(self, other);
}