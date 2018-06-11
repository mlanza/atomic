import {overload} from "./core";
import {IDecode} from "./protocols/idecode";
import {Array, Concatenated, Date, Range, Period, Duration, Months, Years, List, EmptyList} from "./types";

//reference types only
export const decodables = {Array, Concatenated, Date, Range, Period, Duration, Months, Years, List, EmptyList};

function decode1(self){
  return decode2(self, "@type");
}

function decode2(self, label){
  return IDecode.decode(self, label, decodables);
}

export const decode = overload(null, decode1, decode2);

export function deserialize(text){
  return decode(JSON.parse(text));
}