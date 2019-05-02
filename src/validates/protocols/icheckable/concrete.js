import {overload, branch, isString, identity, awaits} from 'cloe/core';
import {anno} from "../../types/annotation/construct";
import {catches} from "../../types/catches/construct";
import {map} from "../../types/map/construct";
import ICheckable from "./instance";

export function parses(parse, constraint){
  return anno({type: 'parse', parse},
    catches(map(branch(isString, parse, identity), constraint)));
}

function check3(self, parse, value){
  return ICheckable.check(parses(parse, self), value);
}

export const check = awaits(overload(null, null, ICheckable.check, check3));