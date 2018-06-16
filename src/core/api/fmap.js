import {overload, partial, identity, constantly} from "../core";
import {IFunctor} from "../protocols/ifunctor";
import {IReduce} from "../protocols/ireduce";

function fmap1(f){
  return function(self){
    return IFunctor.fmap(self, f);
  }
}

function fmapN(...fs){
  return function(self){
    return IReduce.reduce(fs, IFunctor.fmap, self);
  }
}

export const fmap = overload(constantly(identity), fmap1, fmapN);