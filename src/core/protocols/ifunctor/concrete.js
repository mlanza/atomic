import {overload, identity, constantly, partial} from "../../core.js";
import {reduce, reducing} from "../ireducible/concrete.js";
import {deref} from "../ideref/concrete.js";
import {IFunctor} from "./instance.js";

export const fmap = overload(constantly(identity), IFunctor.fmap, reducing(IFunctor.fmap));

function thrushN(unit, init, ...fs){
  return deref(reduce(IFunctor.fmap, unit(init), fs));
}

function thrush1(f){
  return overload(null, f, partial(thrushN, f));
}

export const thrush = overload(null, thrush1, thrushN);

function pipeline1(unit){
  return partial(pipelineN, unit);
}

function pipelineN(unit, ...fs){
  return function(init){
    return thrush(unit, init, ...fs);
  }
}

export const pipeline = overload(null, pipeline1, pipelineN);
