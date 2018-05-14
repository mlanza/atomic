import {partial, observable} from "./types";
import {implement} from "./protocol";
import {map} from "./transducers";
import {pub, sub, IDisposable} from "./protocols";
import {doto, overload, identity} from "./core";

function duct(source, xf, sink){
  const unsub = sub(source, partial(xf(pub), sink));
  return doto(sink,
    implement(IDisposable, {dispose: unsub}));
}

function signal1(source){
  return duct(source, map(identity), observable());
}

function signal2(source, xf){
  return signal3(source, xf, null);
}

function signal3(source, xf, init){
  return duct(source, xf, observable(init));
}

export const signal = overload(null, signal1, signal2, signal3);
