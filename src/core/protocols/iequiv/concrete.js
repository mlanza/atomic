import {overload} from "../../core";
import {IEquiv} from "./instance";
import {reduce} from "../ireduce/concrete";
import {reduced} from "../../types/reduced/construct";
import {get} from "../ilookup/concrete";

export function equiv(self, other){
  return self === other || IEquiv.equiv(self, other);
}

function alike2(self, other){
  return alike3(self, other, Object.keys(self)); //Object.keys looks to internal properties
}

function alike3(self, other, keys) { //same parts? structural equality?
  return reduce(function(memo, key){
    return memo ? equiv(get(self, key), get(other, key)) : reduced(memo);
  }, true, keys);
}

export const alike = overload(null, null, alike2, alike3);