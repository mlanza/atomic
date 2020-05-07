import {constructs} from "atomic/core";

export function FixedURL(url){
  this.url = url;
}

FixedURL.prototype.toString = function(){
  return this.url;
}

export const fixedUrl = constructs(FixedURL);