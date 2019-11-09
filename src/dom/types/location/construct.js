import {global} from "atomic/core";
export const Location = global.Location;

export function isLocation(self){
  return self instanceof Location;
}