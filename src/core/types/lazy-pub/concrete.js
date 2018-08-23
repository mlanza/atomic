import {IPublish, ISubscribe} from "../../protocols";
import {partial, overload} from "../../core";
import {lazyPub} from "./construct";

function conduit2(sink, source){
  return conduit3(sink, identity, source);
}

function conduit3(sink, xf, source){
  const callback = partial(xf(IPublish.pub), sink);
  return lazyPub(sink, function(state){
    const f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
    f(source, callback);
  });
}

export const conduit = overload(null, null, conduit2, conduit3);