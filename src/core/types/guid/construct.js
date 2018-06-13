import {overload} from '../../core';

export default function GUID(id){
  this.id = id;
}

GUID.prototype[Symbol.toStringTag] = "GUID";

function s4() {
  return Math.floor((1 + rand()) * 0x10000).toString(16).substring(1);
}

function guid1(id){
 return new GUID(id);
}

function guid0(){
  return guid1(s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
}

export const guid = overload(guid0, guid1);