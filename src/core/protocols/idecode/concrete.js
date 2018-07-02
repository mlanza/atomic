import {overload} from "../../core";
import IDecode from "./instance";
import Array from "../../types/array/construct";
import Concatenated from "../../types/concatenated/construct";
import Date from "../../types/date/construct";
import Range from "../../types/range/construct";
import Period from "../../types/period/construct";
import Duration from "../../types/duration/construct";
import Months from "../../types/months/construct";
import Years from "../../types/years/construct";
import List from "../../types/list/construct";
import EmptyList from "../../types/empty-list/construct";

export function deserialize(text){
  return decode(JSON.parse(text));
}

//reference types only
export const decodables = {Array, Concatenated, Date, Range, Period, Duration, Months, Years, List, EmptyList};

function decode1(self){
  return decode2(self, "@type");
}

function decode2(self, label){
  return IDecode.decode(self, label, decodables);
}

export const decode = overload(null, decode1, decode2);