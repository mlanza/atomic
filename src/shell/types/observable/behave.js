import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {closed} from "../../protocols/ipublish.js";
import {mergable, reducible} from "../../shared.js";

function sub(self, observer){
  const unsub = self.subscribe(observer) || _.noop;
  return closed(observer) ? (unsub(), _.noop) : unsub;
}

function deref(self){
  let value = null;
  p.sub(self, function(val){
    value = val;
  })(); //immediate unsubscribe
  return value;
}

export default _.does(
  reducible,
  mergable,
  _.keying("Observable"),
  _.implement(_.IDeref, {deref}),
  _.implement(ISubscribe, {sub}));
