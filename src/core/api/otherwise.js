import {overload, partial, identity, constantly} from "../core";
import {IOtherwise} from "../protocols/iotherwise";

function otherwise1(other){
  return function(self){
    return IOtherwise.otherwise(self, other);
  }
}

export const otherwise = overload(null, otherwise1, IOtherwise.otherwise);