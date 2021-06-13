import {does, implement} from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe.js";

function sub(self, observer){
  return self.subscribed(observer); //return unsubscribe fn
}

export const behaveAsObservable = does(
  implement(ISubscribe, {sub}));