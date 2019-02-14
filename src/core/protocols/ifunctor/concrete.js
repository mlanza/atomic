import {overload, identity, constantly, partial} from "../../core";
import {reduce, reducing} from "../ireduce/concrete";
import {deref} from "../ideref/concrete";
import IFunctor from "./instance";

export const fmap = overload(constantly(identity), IFunctor.fmap, reducing(IFunctor.fmap));

export function thrush(unit, init, ...fs){
  return deref(reduce(IFunctor.fmap, unit(init), fs));
}

function pipeline1(unit){
  return partial(pipelineN, unit);
}

function pipelineN(unit, ...fs){
  return function(init){
    return thrush(unit, init, ...fs);
  }
}

export const pipeline = overload(null, pipeline1, pipelineN);