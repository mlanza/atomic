import {constructs} from "atomic/core";

export function URL(url){
  this.url = url;
}

URL.prototype.toString = function(){
  return this.url;
}

export const url = constructs(URL);