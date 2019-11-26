import {overload} from "../../core";
import {IEncode} from "./instance";

function encode1(self){
  return IEncode.encode(self, "@type");
}

export const encode = overload(null, encode1, IEncode.encode);