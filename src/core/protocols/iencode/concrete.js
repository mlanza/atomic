import {overload} from "../../core";
import {IEncode} from "./instance";
import {IHash} from "../ihash";

function encode1(self){
  return IEncode.encode(self, "@type");
}

export const encode = overload(null, encode1, IEncode.encode);

export function serialize(self){
  return JSON.stringify(encode(self));
}

function hash1(self){
  return IHash.hash(self, "@type");
}

export const hash = overload(null, hash1, IHash.hash);