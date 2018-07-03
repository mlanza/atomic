import {overload, counter} from "../../core";
import IEncode from "./instance";
import {IHash} from "../ihash";
import WeakMap from "weak-map";

const encodedRefs   = new WeakMap()
const encodedRefIds = counter();

function encode1(self){
  return encode2(self, "@type");
}

function encode2(self, label){
  return IEncode.encode(self, label, encodedRefs, encodedRefIds);
}

export const encode = overload(null, encode1, encode2, IEncode.encode);

export function serialize(self){
  return JSON.stringify(encode(self));
}

function hash1(self){
  return hash2(self, "@type");
}

function hash2(self, label){
  return IHash.hash(self, label, encodedRefs, encodedRefIds);
}

export const hash = overload(null, hash1, hash2, IHash.hash);