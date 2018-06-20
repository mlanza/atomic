import {overload, identity, constantly} from "../core";
import {chain} from "../types/function/concrete";
import {IFunctor} from "../protocols/ifunctor";
import {reducing} from "../api/reduce";

export const fmap = overload(constantly(identity), IFunctor.fmap, reducing(IFunctor.fmap));

export function fpipe(...fs){
  return function(init){
    return fmap(init, ...fs);
  }
}

export function ftap(...fs){
  return function(init){
    return init.constructor.from(chain(init, ...fs));
  }
}