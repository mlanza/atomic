import {noop} from "atomic/core";
import {IPublish} from "../../protocols/ipublish.js";

export function Observer(pub, err, complete, terminated){
  this.pub = pub;
  this.err = err;
  this.complete = complete;
  this.terminated = terminated;
}

export function observer(pub, err, complete){
  return new Observer(pub || noop, err || noop, complete || noop, null);
}

export function observe(pub, obs){
  return observer(pub, IPublish.err(obs, ?), function(){
    IPublish.complete(obs);
  });
}
