import {noop} from "atomic/core";

export function Observer(pub, err, complete, terminated){
  this.pub = pub;
  this.err = err;
  this.complete = complete;
  this.terminated = terminated;
}

export function observer(pub, err, complete){
  return new Observer(pub || noop, err || noop, complete || noop, null);
}