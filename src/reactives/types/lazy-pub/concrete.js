import {pub, sub, unsub, partial, overload, identity} from "cloe/core";
import {lazyPub} from "../lazy-pub/construct";

function conduit2(sink, source){
  return conduit3(sink, identity, source);
}

function conduit3(sink, xf, source){
  const callback = partial(xf(pub), sink);
  return lazyPub(sink, function(state){
    const f = state === "active" ? sub : unsub;
    f(source, callback);
  });
}

export const conduit = overload(null, null, conduit2, conduit3);