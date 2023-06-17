import {ISeq} from "./instance.js";
import {comp, overload} from "../../core.js";
import {reduced} from "../../types/reduced/construct.js";

function first0(){ //transducer
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return reduced(rf(rf(memo, value)));
    });
  }
}

export const first = overload(first0, ISeq.first);
export const rest = ISeq.rest;
