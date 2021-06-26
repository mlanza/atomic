import {does, once, mapa, noop, implement} from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {IPublish} from "../../protocols/ipublish.js";
import {Observable, observable} from "./construct.js";
import {imergable, ireduce} from "../../shared.js";

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

export default does(
  ireduce,
  imergable,
  implement(ISubscribe, {sub, unsub, subscribed}));