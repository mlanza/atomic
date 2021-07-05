import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ISubscribe} from "../../protocols.js";

function sub(self, observer){
  p.sub(self.source, observer);
  return _.once(function(){
    unsub(self, observer);
  });
}

function unsub(self, observer){
  p.unsub(self.source, observer);
}

function subscribed(self){
  return p.subscribed(self.source);
}

export default _.does(
  _.implement(ISubscribe, {sub, unsub, subscribed}));
