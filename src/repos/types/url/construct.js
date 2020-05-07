import {constructs, overload, identity} from "atomic/core";
import {_ as v} from "param.macro";

export function URL(url, xfq){
  this.url = url;
  this.xfq = xfq;
}

URL.prototype.toString = function(){
  return this.url;
}

function url1(url){
  return url2(url, identity);
}

const url2 = constructs(URL);

export const url = overload(null, url1, url2);