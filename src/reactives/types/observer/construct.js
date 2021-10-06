import * as _ from "atomic/core";
import Symbol from "symbol";

export function Observer(pub, err, complete, terminated){
  this.pub = pub;
  this.err = err;
  this.complete = complete;
  this.terminated = terminated;
}

Observer.prototype[Symbol.toStringTag] = "Observer";

export function observer(pub, err, complete){
  return new Observer(pub || _.noop, err || _.noop, complete || _.noop, null);
}
