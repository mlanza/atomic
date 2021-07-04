import * as _ from "atomic/core";

export function URL(url, xfq){
  this.url = url;
  this.xfq = xfq;
}

URL.prototype.toString = function(){
  return this.url;
}

function url1(url){
  return url2(url, _.identity);
}

const url2 = _.constructs(URL);

export const url = _.overload(null, url1, url2);
