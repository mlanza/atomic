import {IFlatMappable} from "./instance.js";
import {overload} from "../../core.js";
import {reduce} from "../ireducible.js";

function flat0(){ //transducer
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return reduce(memo, rf, value);
    });
  }
}

export const flatMap = IFlatMappable.flatMap;
export const flat = overload(flat0, IFlatMappable.flat);
export const cat = flat;
