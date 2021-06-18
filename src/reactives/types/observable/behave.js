import {does, nullary, once, mapa, noop, implement, IReduce, IMergeable} from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {IPublish} from "../../protocols/ipublish.js";
import {observable} from "./construct.js";

function sub(self, observer){
  self.subscriptions.unshift({observer, unsub: once(self.subscribe(observer) || noop)});
  return function(){
    return unsub(self, observer);
  }
}

function unsub(self, observer){ //TODO added for cross compatibility, may remove post migration
  for(var n in self.subscriptions){
    let subscription = self.subscriptions[n];
    if (subscription.observer === observer){
      subscription.unsub();
      self.subscriptions.splice(n, 1);
      return;
    }
  }
}

function subscribed(){
  return self.subscriptions.length;
}

function reduce(self, xf, init){
  return ISubscribe.sub(init, xf(self, ?));
}

function merge(self, other){
  return observable(function(observer){
    const handle = IPublish.pub(observer, ?);
    return nullary(does(ISubscribe.sub(self, handle), ISubscribe.sub(other, handle)));
  });
}

export const behaveAsObservable = does(
  implement(IMergeable, {merge}),
  implement(IReduce, {reduce}),
  implement(ISubscribe, {sub, unsub, subscribed}));