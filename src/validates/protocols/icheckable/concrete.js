import * as _ from "atomic/core";
import {anno} from "../../types/annotation/construct.js";
import {catches} from "../../types/catches/construct.js";
import {map} from "../../types/map/construct.js";
import {ICheckable} from "./instance.js";

export function parses(parse, constraint){
  return anno({type: 'parse', parse},
    catches(map(_.branch(_.isString, parse, _.identity), constraint)));
}

function check3(self, parse, value){
  return ICheckable.check(parses(parse, self), value);
}

export const check = _.awaits(_.overload(null, null, ICheckable.check, check3));
