import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {closed} from "../../protocols/ipublish.js";
import {imergable, ireduce} from "../../shared.js";
import Symbol from "symbol";

function sub(self, observer){
  const unsub = self.subscribe(observer) || _.noop;
  return closed(observer) ? (unsub(), _.noop) : unsub;
}

const deref = _.called(function deref(self){
  let value = null;
  p.sub(self, function(val){
    value = val;
  })(); //immediate unsubscribe
  return value;
}, "Prefer to subscribe to observables rather than `deref` them.");

export default _.does(
  ireduce,
  imergable,
  _.naming(?, Symbol("Observable")),
  _.implement(_.IDeref, {deref}),
  _.implement(ISubscribe, {sub}));
